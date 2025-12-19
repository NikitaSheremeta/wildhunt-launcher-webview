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

  const updateDataTime = (durationSeconds) => {
    let minutes = Math.floor(durationSeconds / SIXTY_SECONDS);
    let seconds = Math.floor(durationSeconds % SIXTY_SECONDS);

    minutes = minutes < TEN_SECONDS ? '0' + minutes : minutes;
    seconds = seconds < TEN_SECONDS ? '0' + seconds : seconds;

    data.time = minutes + ':' + seconds;
  };

  const destroyTimer = () => {
    localStorage.removeItem('timerTimestamp');
    localStorage.removeItem('timerDuration');

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

    localStorage.setItem('timerTimestamp', currentTimestamp.toString());
    localStorage.setItem('timerDuration', durationSeconds.toString());

    timerHandle(durationSeconds);
  };

  const checkTimer = () => {
    const storageTimestamp = Number(localStorage.getItem('timerTimestamp'));
    const storageDuration = Number(localStorage.getItem('timerDuration'));

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
