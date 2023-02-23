import styles from '@styles/components/TaskBar.scss';
import htmlTemplate from '@templates/components/TaskBar.html?raw';

import CustomElement from '@/CustomElement';
import { getApplication } from '@constants/application';

import type { ApplicationEventProps } from '@defs/application';

class TaskBar extends CustomElement {
  template = this.getShadow();

  #currentTime = new Date();

  #currentTimeCallback: number | undefined;

  #currentDateCallback: number | undefined;

  #intlTimeFormat = this.formatDateTime();

  #intlDateFormat = this.formatDateTime(false);

  items: string[] = [];

  regex = /(?<=\()[^)]*(?=\))/;

  constructor() {
    super();
    this.addArrayValues('items');
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  connectedCallback() {
    if (!Array.isArray(this.items)) {
      throw new Error(`Expected an array for attribute 'items' but received ${typeof this.items}.`);
    }

    const tasksContainer = this.template.querySelector('#tasks');

    if (tasksContainer) {
      this.items.forEach((item) => {

        // System for class item
        const match = this.regex.exec(item);
        const classItem = match ? match[0].split(';') : [];

        const application = getApplication(item.split('|')[0]);

        if (application) {
          const navItem = document.createElement('button');
          const text = document.createElement('span');

          navItem.classList.add('icon', 'tooltip', ...classItem);
          navItem.ariaLabel = `open ${ application.name }`;
          navItem.addEventListener('click', () => {
            const app = document.querySelector(application.component);
            window.dispatchEvent(new CustomEvent<ApplicationEventProps>( app ? 'stash-window' : 'open-window', { detail: { name: application.name } }));
            if (app) window.dispatchEvent(new CustomEvent<ApplicationEventProps>('select-window', { detail: { name: application.name } }));
          });

          window.addEventListener('close-window', (e: Event) => {
            if (e instanceof CustomEvent) {
              const event = e as CustomEvent<ApplicationEventProps>;
              if (event.detail.name === application.name) {
                navItem.classList.contains('icon-active') ? navItem.classList.remove('icon-active') : null;
              }
            }
          });

          window.addEventListener('open-window', (e: Event) => {
            if (e instanceof CustomEvent) {
              const event = e as CustomEvent<ApplicationEventProps>;
              if (event.detail.name === application.name) {
                !navItem.classList.contains('icon-active') ? navItem.classList.add('icon-active') : null;
              }
            }
          });

          text.classList.add('tooltip-content');
          text.textContent = application.name;
          navItem.appendChild(text);
          text.insertAdjacentHTML('afterend', application.icon);

          tasksContainer.appendChild(navItem);
        }
      });
    }

    this.timeTask();

    window.addEventListener('storage', this.timeTask.bind(this));
  }

  timeTask() {
    const infoContainer = this.template.querySelector('#info');

    const currentTimeSpan = infoContainer?.querySelector('#current-time');
    const currentDateSpan = infoContainer?.querySelector('#current-date');

    clearInterval(this.#currentTimeCallback);
    clearInterval(this.#currentDateCallback);

    if (currentTimeSpan) {
      if (localStorage.getItem('time') === 'true') {
        this.#intlTimeFormat = this.formatDateTime();
        currentTimeSpan.textContent = this.#intlTimeFormat.format(this.#currentTime);

        this.#currentTimeCallback = setInterval(() => {
          this.#currentTime = new Date();

          currentTimeSpan.textContent = this.#intlTimeFormat.format(this.#currentTime);
        }, 1000);
      } else {
        currentTimeSpan.textContent = '';
      }
    }

    if (currentDateSpan) {
      if (localStorage.getItem('date') === 'true') {
        this.#intlDateFormat = this.formatDateTime(false);
        currentDateSpan.textContent = this.#intlDateFormat.format(this.#currentTime);

        this.#currentDateCallback = setInterval(() => {
          this.#currentTime = new Date();

          // Check for new day
          if (this.#currentTime.getSeconds() === 0) {
            currentDateSpan.textContent = this.#intlDateFormat.format(this.#currentTime);
          }
        }, 1000);
      } else {
        currentDateSpan.textContent = '';
      }
    }
  }

  formatDateTime (isTime = true): Intl.DateTimeFormat {
    return isTime ? new Intl.DateTimeFormat(
      'en',
      {
        hour: 'numeric',
        minute: localStorage.getItem('minute') === 'true' ? 'numeric' : undefined,
        second: localStorage.getItem('second') === 'true' ? 'numeric' : undefined,
        hour12: true,
      },
    ) : new Intl.DateTimeFormat(
      'en',
      {
        year: localStorage.getItem('year') === 'true' ? 'numeric' : undefined,
        month: localStorage.getItem('month') === 'true' ? 'numeric' : undefined,
        day: localStorage.getItem('day') === 'true' ? '2-digit' : undefined,
      },
    );
  }

  disconnectedCallback() {
    clearInterval(this.#currentTimeCallback);
    clearInterval(this.#currentDateCallback);
  }

  static get observedAttributes() {
    return ['items'];
  }
}

export default TaskBar;
