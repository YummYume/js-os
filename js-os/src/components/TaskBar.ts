import styles from '@styles/components/TaskBar.scss';
import htmlTemplate from '@templates/components/TaskBar.html?raw';

import CustomElement from '@/CustomElement';
import { getApplication } from '@constants/application';

import type { ApplicationEventProps } from '@defs/application';

class TaskBar extends CustomElement {
  #currentTime = new Date();

  #currentTimeCallback: number | undefined;

  #intlTimeFormat = new Intl.DateTimeFormat(
    'en',
    { hour: 'numeric', minute: 'numeric', hour12: false },
  );

  #intlDateFormat = new Intl.DateTimeFormat(
    'en',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

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

    const template = this.getShadow();
    const tasksContainer = template.querySelector('#tasks');
    const infoContainer = template.querySelector('#info');

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

    const currentTimeSpan = infoContainer?.querySelector('#current-time');
    const currentDateSpan = infoContainer?.querySelector('#current-date');

    if (currentTimeSpan) {
      currentTimeSpan.textContent = this.#intlTimeFormat.format(this.#currentTime);
    }

    if (currentDateSpan) {
      currentDateSpan.textContent = this.#intlDateFormat.format(this.#currentTime);
    }

    if (currentTimeSpan) {
      this.#currentTimeCallback = setInterval(() => {
        this.#currentTime = new Date();

        currentTimeSpan.textContent = this.#intlTimeFormat.format(this.#currentTime);

        // Check for new day
        if (currentDateSpan && this.#currentTime.getSeconds() === 0) {
          currentDateSpan.textContent = this.#intlDateFormat.format(this.#currentTime);
        }
      }, 1000);
    }
  }

  disconnectedCallback() {
    clearInterval(this.#currentTimeCallback);
  }

  static get observedAttributes() {
    return ['items'];
  }
}

export default TaskBar;
