const DELAY_MS = 300;

export function debounce(callback, wait = DELAY_MS) {
  if (typeof callback !== 'function') {
    throw new TypeError('debounce: callback must be a function');
  }

  let timerId = null;

  return function () {
    const context = this;
    const args = arguments;

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback.apply(context, args);
    }, wait);
  };
}
