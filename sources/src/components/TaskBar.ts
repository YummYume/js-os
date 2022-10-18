import htmlTemplate from '@templates/TaskBar.html?raw';
import CustomElement from '@/CustomElement';

class TaskBar extends CustomElement {
    items = [];

    #isArrayValue = [
        'items'
    ];

    constructor() {
        super();
        this.setTemplate(htmlTemplate);
    }

    connectedCallback() {
        if (!Array.isArray(this.items)) {
            throw new Error(`Expected an array for attribute 'items' but received ${typeof this.items}.`);
        }

        const template = this.getTemplate();
        const container = template.querySelector('#container');

        if (!container) {
            return;
        }

        this.items.forEach((item) => {
            const navItem = document.createElement('span');
            navItem.textContent = item;

            container.appendChild(navItem);
        });

        this.appendToShadow(template);
    }

    static get observedAttributes() {
        return ['items'];
    }

    attributeChangedCallback(property: string, oldValue: any, newValue: any) {
        const value = this.#isArrayValue.includes(property) ? newValue.split(',') : newValue;

        if (oldValue === value) {
            return;
        }

        this[property as keyof this] = value;
    }
}

export default TaskBar;
