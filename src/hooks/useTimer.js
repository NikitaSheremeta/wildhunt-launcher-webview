import { reactive } from 'vue';

const SIXTY_SECONDS = 60;
const TEN_SECONDS = 10;
const ONE_THOUSAND_MILLISECONDS = 1000;

export function useTimer() {
  const data = reactive({
    active: false,
    time: '00:00',
    createTimer: (durationSeconds) => {
      createTimer(durationSeconds);
    },
    checkTimer: () => {
      checkTimer();
    },
  });

  const safeGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const safeRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  };

  const updateDataTime = (durationSeconds) => {
    let minutes = Math.floor(durationSeconds / SIXTY_SECONDS);
    let seconds = Math.floor(durationSeconds % SIXTY_SECONDS);

    minutes = minutes < TEN_SECONDS ? '0' + minutes : minutes;
    seconds = seconds < TEN_SECONDS ? '0' + seconds : seconds;

    data.time = minutes + ':' + seconds;
  };

  const destroyTimer = () => {
    safeRemove('timerTimestamp');
    safeRemove('timerDuration');

    data.active = false;
  };

  const timerHandle = (durationSeconds) => {
    if (durationSeconds > 0) {
      data.active = true;

      updateDataTime(durationSeconds);

      --durationSeconds;

      const interval = setInterval(() => {
        updateDataTime(durationSeconds);

        --durationSeconds;

        if (durationSeconds < 0) {
          destroyTimer();

          clearInterval(interval);
        }
      }, ONE_THOUSAND_MILLISECONDS);
    }

    if (durationSeconds < 0) {
      destroyTimer();
    }
  };

  const createTimer = (durationSeconds) => {
    const currentTimestamp = Math.floor(Date.now() / ONE_THOUSAND_MILLISECONDS);

    // localStorage may be unavailable in embedded WebView (file:/, jar:/) origins.
    // Timer should still work in-memory even if persistence fails.
    safeSet('timerTimestamp', currentTimestamp.toString());
    safeSet('timerDuration', durationSeconds.toString());

    timerHandle(durationSeconds);
  };

  const checkTimer = () => {
    const storageTimestamp = Number(safeGet('timerTimestamp'));
    const storageDuration = Number(safeGet('timerDuration'));

    if (!storageTimestamp || !storageDuration) {
      destroyTimer();
      return;
    }

    const currentTimestamp = Math.floor(Date.now() / ONE_THOUSAND_MILLISECONDS);

    const timeDifference = storageDuration - (currentTimestamp - storageTimestamp);

    timerHandle(timeDifference);
  };

  return data;
}
