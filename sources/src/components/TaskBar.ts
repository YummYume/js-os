import CustomElement from '@/CustomElement';
import htmlTemplate from '@templates/components/TaskBar.html?raw';
import styles from '@styles/components/TaskBar.scss';

class TaskBar extends CustomElement {
    #currentTime = new Date();
    #currentTimeCallback: number | undefined;
    #intlTimeFormat = new Intl.DateTimeFormat(
        'fr',
        { hour: 'numeric', minute: 'numeric', hour12: false }
    );
    #intlDateFormat = new Intl.DateTimeFormat(
        'fr',
        { day: '2-digit', month: 'long', year: 'numeric' }
    );

    items = [];

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

        const template = this.getTemplate();
        const tasksContainer = template.querySelector('#tasks');
        const infoContainer = template.querySelector('#info');

        if (tasksContainer) {
            this.items.forEach((item) => {
                const navItem = document.createElement('span');
                navItem.textContent = item;

                tasksContainer.appendChild(navItem);
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

                if (currentTimeSpan) {
                    currentTimeSpan.textContent = this.#intlTimeFormat.format(this.#currentTime);
                }

                // New day
                if (currentDateSpan && this.#currentTime.getHours() === 0 && this.#currentTime.getMinutes() === 0 && this.#currentTime.getSeconds() === 0) {
                    currentDateSpan.textContent = this.#intlDateFormat.format(this.#currentTime);
                }
            }, 1000);
        }

        this.appendToShadow(template);
    }

    disconnectedCallback() {
        clearInterval(this.#currentTimeCallback);
    }

    static get observedAttributes() {
        return ['items'];
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    attributeChangedCallback(property: string, oldValue: any, newValue: any) {
        super.attributeChangedCallback(property, oldValue, newValue);
    }
}

export default TaskBar;
