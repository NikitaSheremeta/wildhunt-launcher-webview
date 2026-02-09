/**
 * JS ↔ JavaFX WebView bridge (request/response).
 *
 * Goals:
 * - Vue UI never does fetch/axios directly.
 * - Vue talks to Java via a global object: window.launcher
 * - All calls are async and return Promises.
 * - Java never mutates Pinia stores directly — it only sends data back.
 *
 * Java-side transport expectation:
 * - Java injects a global object `window.launcher` with one of methods:
 *   - postMessage(stringJson)
 *   - request(stringJson)
 *   - send(stringJson)
 *
 * JS-side receive endpoint for Java:
 * - Java calls: window.__launcherBridge.receive(stringJson)
 *
 * Message format (JSON):
 * Request:
 *   { "type":"request", "id":"...", "method":"auth.login", "params":{...} }
 * Response (success or non-200):
 *   { "type":"response", "id":"...", "status":200, "data":{...} }
 * Transport / unexpected error:
 *   { "type":"error", "id":"...", "code":"...", "message":"...", "details":{...} }
 * Optional event:
 *   { "type":"event", "name":"auth.changed", "payload":{...} }
 */

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_IN_FLIGHT = 200;

let _seq = 0;
const _pending = new Map(); // id -> { resolve, reject, timerId, method, createdAt }
const _eventListeners = new Map(); // name -> Set(fn)

export class LauncherBridgeError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {object} [extra]
   */
  constructor(code, message, extra) {
    super(message);
    this.name = 'LauncherBridgeError';
    this.code = code;
    if (extra && typeof extra === 'object') {
      Object.assign(this, extra);
    }
  }
}

function _now() {
  return Date.now();
}

function _makeId() {
  _seq = (_seq + 1) % Number.MAX_SAFE_INTEGER;
  // Avoid crypto dependencies (JavaFX WebView may lag behind modern APIs)
  return `wh-${_now()}-${_seq}-${Math.random().toString(16).slice(2)}`;
}

function _safeJsonParse(raw) {
  if (raw == null) return null;
  if (typeof raw === 'object') return raw;
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function _getTransport() {
  const launcher = window.launcher;
  if (!launcher) return null;

  if (typeof launcher.postMessage === 'function') return launcher.postMessage.bind(launcher);
  if (typeof launcher.request === 'function') return launcher.request.bind(launcher);
  if (typeof launcher.send === 'function') return launcher.send.bind(launcher);

  return null;
}

function _enqueueMicrotask(fn) {
  // queueMicrotask is supported in modern engines; fall back safely if needed.
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
    return;
  }
  Promise.resolve().then(fn);
}

function _emitEvent(name, payload) {
  const listeners = _eventListeners.get(name);
  if (!listeners || listeners.size === 0) return;
  for (const cb of listeners) {
    try {
      cb(payload);
    } catch (e) {
      // Avoid breaking the bridge on user-land handler errors.

      console.error(`[launcher-bridge] event handler error for "${name}"`, e);
    }
  }
}

function _cleanupPending(id) {
  const entry = _pending.get(id);
  if (!entry) return;
  clearTimeout(entry.timerId);
  _pending.delete(id);
}

/**
 * Called by Java: window.__launcherBridge.receive(jsonString)
 * @param {string|object} rawMessage
 */
export function receive(rawMessage) {
  // Critical: never resolve Promises synchronously inside Java->JS callback stack.
  // We schedule delivery into a microtask to avoid re-entrancy issues with Vue reactivity.
  _enqueueMicrotask(() => {
    const msg = _safeJsonParse(rawMessage);
    if (!msg || typeof msg !== 'object') {
      console.warn('[launcher-bridge] invalid message (not JSON object)');
      return;
    }

    if (msg.type === 'event' && typeof msg.name === 'string') {
      _emitEvent(msg.name, msg.payload);
      return;
    }

    const id = msg.id;
    if (typeof id !== 'string' || !id) {
      console.warn('[launcher-bridge] message without id');
      return;
    }

    const entry = _pending.get(id);
    if (!entry) {
      // Late/duplicate response. Ignore.
      return;
    }

    _cleanupPending(id);

    if (msg.type === 'error') {
      entry.reject(
        new LauncherBridgeError(msg.code || 'JAVA_ERROR', msg.message || 'Ошибка в Java-слое', {
          details: msg.details,
          request: { id, method: entry.method },
        }),
      );
      return;
    }

    if (msg.type !== 'response') {
      entry.reject(
        new LauncherBridgeError('INVALID_MESSAGE', 'Некорректный тип сообщения от Java', {
          received: msg,
          request: { id, method: entry.method },
        }),
      );
      return;
    }

    // "status" can be any number-like; we keep it as-is.
    entry.resolve({ status: msg.status, data: msg.data });
  });
}

/**
 * Subscribe to bridge events coming from Java.
 * Java never mutates Pinia directly; it may emit events, Vue decides what to do.
 *
 * @param {string} name
 * @param {(payload:any)=>void} cb
 * @returns {() => void} unsubscribe
 */
export function onEvent(name, cb) {
  if (!_eventListeners.has(name)) {
    _eventListeners.set(name, new Set());
  }
  const set = _eventListeners.get(name);
  set.add(cb);
  return () => set.delete(cb);
}

/**
 * Request to Java via window.launcher transport.
 *
 * NOTE:
 * - We resolve with `{ status, data }` for any HTTP-like outcome.
 * - We reject only for transport/bridge errors (no launcher, timeout, invalid response, etc.).
 *
 * @param {string} method
 * @param {any} [params]
 * @param {{ timeoutMs?: number }} [options]
 * @returns {Promise<{status:any, data:any}>}
 */
export function request(method, params, options = {}) {
  if (typeof method !== 'string' || !method) {
    return Promise.reject(new LauncherBridgeError('INVALID_METHOD', 'method должен быть непустой строкой'));
  }

  if (_pending.size >= MAX_IN_FLIGHT) {
    return Promise.reject(
      new LauncherBridgeError('BACKPRESSURE', 'Слишком много запросов в полёте (bridge backpressure)'),
    );
  }

  const transport = _getTransport();
  if (!transport) {
    return Promise.reject(
      new LauncherBridgeError(
        'BRIDGE_UNAVAILABLE',
        'window.launcher недоступен или не поддерживает postMessage/request/send',
      ),
    );
  }

  const id = _makeId();
  const timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(0, options.timeoutMs) : DEFAULT_TIMEOUT_MS;

  const message = {
    type: 'request',
    id,
    method,
    params: params ?? null,
  };

  return new Promise((resolve, reject) => {
    const timerId =
      timeoutMs > 0
        ? setTimeout(() => {
            _pending.delete(id);
            reject(
              new LauncherBridgeError('TIMEOUT', `Таймаут ответа от Java (${timeoutMs}ms)`, {
                request: { id, method },
              }),
            );
          }, timeoutMs)
        : null;

    _pending.set(id, { resolve, reject, timerId, method, createdAt: _now() });

    try {
      transport(JSON.stringify(message));
    } catch (e) {
      _cleanupPending(id);
      reject(
        new LauncherBridgeError('TRANSPORT_ERROR', 'Ошибка отправки сообщения в Java', {
          cause: e,
          request: { id, method },
        }),
      );
    }
  });
}

/**
 * Auth API wrapper (exact methods requested in the task).
 */
export const launcherAuth = Object.freeze({
  /**
   * @param {string} login
   * @param {string} password
   */
  login(login, password) {
    return request('auth.login', { login, password });
  },
  logout() {
    return request('auth.logout');
  },
  checkAuth() {
    return request('auth.checkAuth');
  },
});

// Expose receive endpoint for Java (stable name).
if (typeof window !== 'undefined') {
  window.__launcherBridge = window.__launcherBridge || {};
  window.__launcherBridge.receive = receive;
}
