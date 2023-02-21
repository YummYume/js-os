import styles from '@styles/applications/Clock.scss';
import htmlTemplate from '@templates/applications/Clock.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Clock extends Application implements ApplicationType {
  name = APPLICATION.CLOCK.name;

  template = this.getShadow();

  #clock: number | null = null;

  #stopwatch: number | null = null;
  #startStopwatch: number = 0;
  #elapsedTime: number = 0;

  #btnStartWatch: HTMLButtonElement | null = null;
  #btnStopWatch: HTMLButtonElement | null = null;
  #btnResetWatch: HTMLButtonElement | null = null;

  #timer: number | null = null;
  #startTimer: number = 0;
  #endTimer: number = 0;
  #remainingTime: number = 0;

  #displayTimer: HTMLDivElement | null = null;
  #inputHours: HTMLInputElement | null = null;
  #inputMinutes: HTMLInputElement | null = null;
  #inputSeconds: HTMLInputElement | null = null;

  #btnStartTimer: HTMLButtonElement | null = null;
  #btnStopTimer: HTMLButtonElement | null = null;
  #btnResetTimer: HTMLButtonElement | null = null;

  #swapperPrevious: HTMLButtonElement | null = null;
  #swapperNext: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.appendStyle(styles);
    this.setupApp({
      cbRun: this.run.bind(this),
    });
  }

  run() {
    this.windowDiv = this.template.querySelector('.window');

    if (this.windowDiv) {
      const contentWindow = this.windowDiv.lastElementChild;
      const appTemplate = this.convertStringToNode(htmlTemplate);

      if (contentWindow && appTemplate) {
        contentWindow.appendChild(appTemplate);

        this.#swapperPrevious = this.windowDiv.querySelector('[data-clock-swapper="previous"]');
        this.#swapperNext = this.windowDiv.querySelector('[data-clock-swapper="next"]');

        this.#swapperPrevious?.addEventListener('click', this.swapPrevious.bind(this));
        this.#swapperNext?.addEventListener('click', this.swapNext.bind(this));

        this.clockEngine();
        this.#clock = setInterval(this.clockEngine.bind(this), 1000);

        this.stopwatchEngine();
        this.timerEngine();
      }
    }
  }

  stop() {
    if (this.#clock) clearInterval(this.#clock);
    if (this.#stopwatch) clearInterval(this.#stopwatch);
    if (this.#timer) clearInterval(this.#timer);

    this.#swapperPrevious?.removeEventListener('click', this.swapPrevious.bind(this));
    this.#swapperNext?.removeEventListener('click', this.swapNext.bind(this));

    this.#btnStartWatch?.removeEventListener('click', this.startSTWatch.bind(this), false);
    this.#btnStopWatch?.removeEventListener('click', this.stopSTWatch.bind(this), false);
    this.#btnResetWatch?.removeEventListener('click', this.resetSTWatch.bind(this), false);

    this.#btnStartTimer?.removeEventListener('click', this.startTimer.bind(this), false);
    this.#btnStopTimer?.removeEventListener('click', this.stopTimer.bind(this), false);
    this.#btnResetTimer?.removeEventListener('click', this.resetTimer.bind(this), false);
  }

  swapPrevious() {
    if (!this.windowDiv || !this.#swapperPrevious || !this.#swapperNext) {
      return;
    }

    const currentApp = this.windowDiv.querySelector('.active');

    if (currentApp) {
      if (currentApp.previousElementSibling) {
        this.#swapperPrevious.style.display = 'block';

        if (!currentApp.previousElementSibling.previousElementSibling || 
          currentApp.previousElementSibling.previousElementSibling.classList.contains('swapper-buttons')
          ) {
          this.#swapperPrevious.style.display = 'none';
          this.#swapperNext.style.display = 'block';
        }

        currentApp.classList.remove('active');
        currentApp.previousElementSibling.classList.add('active');
      }
    }
  }

  swapNext() {
    if (!this.windowDiv || !this.#swapperNext || !this.#swapperPrevious) {
      return;
    }
    
    const currentApp = this.windowDiv.querySelector('.active');
    if (currentApp) {
      if (currentApp.nextElementSibling) {
        this.#swapperNext.style.display = 'block';

        if (!currentApp.nextElementSibling.nextElementSibling) {
          this.#swapperPrevious.style.display = 'block';
          this.#swapperNext.style.display = 'none';
        }

        currentApp.classList.remove('active');
        currentApp.nextElementSibling.classList.add('active');
      }
    }
  }

  timerEngine() {
    if (!this.windowDiv) return;

    const timer = this.windowDiv.querySelector('.timer');

    if (!timer) return;
    
    this.#displayTimer = timer.querySelector('.display');
    this.#inputHours = timer.querySelector('.input-hours');
    this.#inputMinutes = timer.querySelector('.input-minutes');
    this.#inputSeconds = timer.querySelector('.input-seconds');

    this.#btnStartTimer = timer.querySelector('.start');
    this.#btnStopTimer = timer.querySelector('.stop');
    this.#btnResetTimer = timer.querySelector('.reset');

    this.#btnStartTimer?.addEventListener('click', this.startTimer.bind(this), false);
    this.#btnStopTimer?.addEventListener('click', this.stopTimer.bind(this), false);
    this.#btnResetTimer?.addEventListener('click', this.resetTimer.bind(this), false);
  }

  startTimer() {
    if (this.#timer) return;

    if(!this.#inputMinutes || !this.#inputSeconds || !this.#inputHours || !this.#displayTimer) {
      return;
    }
 
    const hours = this.#inputHours.value ? parseInt(this.#inputHours.value) : 0;
    const minutes = this.#inputMinutes.value ? parseInt(this.#inputMinutes.value) : 0;
    const seconds = this.#inputSeconds.value ? parseInt(this.#inputSeconds.value) : 0;
    const duration = ((hours * 60 + minutes) * 60 + seconds) * 1000;
  
    this.#startTimer = Date.now();
    this.#endTimer = this.#startTimer + (this.#remainingTime > 0  ? this.#remainingTime : duration);
    this.#timer = setInterval(this.updateTimerDisplay.bind(this), 10);
  }
  
  stopTimer() {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
  }
  
  resetTimer() {
    if(!this.#inputMinutes || !this.#inputSeconds || !this.#inputHours || !this.#displayTimer) {
      return;
    }

    this.stopTimer();

    this.#remainingTime = 0;
    this.#displayTimer.textContent = '00:00:00.000';
    this.#inputHours.value = '0';
    this.#inputMinutes.value = '0';
    this.#inputSeconds.value = '0';
  }
  
  updateTimerDisplay() {
    if (!this.#displayTimer) return;

    this.#remainingTime = this.#endTimer - Date.now();

    if (this.#remainingTime <= 0) {
      window.dispatchEvent(new CustomEvent<{ message: string }>("toast", { detail: { message: "Timer done !" } }));

      this.stopTimer();
      this.#displayTimer.textContent = '00:00:00.000';

      return;
    }

    const hours = Math.floor(this.#remainingTime / 3600000);
    const minutes = Math.floor((this.#remainingTime % 3600000) / 60000);
    const seconds = Math.floor((this.#remainingTime % 60000) / 1000);
    const milliseconds = this.#remainingTime % 1000;

    this.#displayTimer.textContent = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}:${this.padZero(milliseconds, 3)}`;
  }

  // Stopwatch
  stopwatchEngine() {
    if (!this.windowDiv) return;

    const stopwatch = this.windowDiv.querySelector('.stopwatch');

    if (!stopwatch) return;

    this.#btnStartWatch = stopwatch.querySelector('.start');
    this.#btnStopWatch = stopwatch.querySelector('.stop');
    this.#btnResetWatch = stopwatch.querySelector('.reset');

    this.#btnStartWatch?.addEventListener('click', this.startSTWatch.bind(this), false);
    this.#btnStopWatch?.addEventListener('click', this.stopSTWatch.bind(this), false);
    this.#btnResetWatch?.addEventListener('click', this.resetSTWatch.bind(this), false);
  }

  startSTWatch() {
    if (this.#stopwatch) return;
    this.#startStopwatch = Date.now() - this.#elapsedTime;
    this.#stopwatch = setInterval(this.updateDisplay.bind(this), 10);
  }

  stopSTWatch() {
    if (this.#stopwatch) clearInterval(this.#stopwatch);
    this.#stopwatch = null;
  }

  resetSTWatch() {
    this.stopSTWatch();
    this.#elapsedTime = 0;
    this.#startStopwatch = Date.now() - this.#elapsedTime;
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.windowDiv) return;

    const stopwatch = this.windowDiv.querySelector('.stopwatch');

    if (!stopwatch) return;

    const display = stopwatch.querySelector('.display');

    const minutes = Math.floor(this.#elapsedTime / 60000);
    const seconds = Math.floor((this.#elapsedTime % 60000) / 1000);
    const milliseconds = this.#elapsedTime % 1000;
    if (display) {
      display.textContent = `${this.padZero(minutes)}:${this.padZero(seconds)}.${this.padZero(milliseconds, 3)}`;
    }

    this.#elapsedTime = Date.now() - this.#startStopwatch;
  }

  padZero(number: number, size = 2) {
    let padded = number.toString();
    while (padded.length < size) {
      padded = '0' + padded;
    }
    return padded;
  }

  // Clock
  clockEngine() {
    if (!this.windowDiv) {
      return;
    }

    const hoursEl = this.windowDiv.querySelector<HTMLSpanElement>('.hour');
    const secondEl = this.windowDiv.querySelector<HTMLSpanElement>('.second');
    const minuteEl = this.windowDiv.querySelector<HTMLSpanElement>('.minute');

    if(!hoursEl || !secondEl || !minuteEl) {
      return;
    }

    const date = new Date();

    const hours = ((date.getHours() + 11) % 12 + 1) * 30;
    const minutes = date.getMinutes() * 6;
    const seconds = date.getSeconds() * 6;

    hoursEl.style.transform = `rotate(${hours}deg)`;
    minuteEl.style.transform = `rotate(${minutes}deg)`;
    secondEl.style.transform = `rotate(${seconds}deg)`;
  }
}

export default Clock;
