import styles from '@styles/applications/Settings.scss';
import htmlTemplate from '@templates/applications/Settings.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';
import { isNull } from '@utils/tools';

class Settings extends Application implements ApplicationType {
  name = APPLICATION.SETTINGS.name;

  template = this.getShadow();

  static OPTIONS_AVAILABLE: string[] = [
    "network",
    "date",
    "year",
    "month",
    "day",
    "time",
    "minute",
    "second",
    "battery"
  ]

  #options: NodeListOf<HTMLInputElement> | [] = [];

  constructor() {
    super();
    this.appendStyle(styles);
    this.setupApp({
      cbRun: this.run.bind(this),
      cbStop: this.stop.bind(this),
    });
  }

  run() {
    this.windowDiv = this.template.querySelector('.window');

    if (this.windowDiv) {
      const contentWindow = this.windowDiv.lastElementChild;
      const appTemplate = this.convertStringToNode(htmlTemplate);

      if (contentWindow && appTemplate) {
        contentWindow.appendChild(appTemplate);

        this.#options = this.windowDiv.querySelectorAll('[data-setting]');
        this.#options.forEach((option) => {
          if (option.dataset.setting) {
            const state = localStorage.getItem(option.dataset.setting);
            if (!isNull(state)) {
              option.checked = state === "true";
            } else {
              option.checked = true;
              localStorage.setItem(option.dataset.setting, `${true}`);
            }
          } 

          option.addEventListener('change', this.optionChange.bind(this));
        });
      }
    }
  }

  stop() {
    this.#options.forEach((option) => {
      option.removeEventListener('change', this.optionChange.bind(this));
    });
  }

  optionChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      if (event.target.dataset && event.target.dataset.setting) {
        localStorage.setItem(event.target.dataset.setting, `${event.target.checked}`);
        window.dispatchEvent(new Event('storage'));
      }
    }
  }
}

export default Settings;
