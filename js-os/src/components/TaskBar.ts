import styles from '@styles/components/TaskBar.scss';
import htmlTemplate from '@templates/components/TaskBar.html?raw';

import CustomElement from '@/CustomElement';
import { getApplication } from '@constants/application';

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
        const application = getApplication(item);

        if (application) {
          const navItem = document.createElement('button');
          const text = document.createElement('span');

          navItem.classList.add('icon', 'tooltip');
          navItem.ariaLabel = `open ${ application.name }`;
          navItem.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('open-app', { detail: application.name }));
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
