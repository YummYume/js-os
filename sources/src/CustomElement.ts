import { removeChildNodes } from '@utils/removeChildFromElement';

class CustomElement extends HTMLElement {
    #shadow = this.attachShadow({ mode : 'closed' });
    #styles = document.createElement('style');
    #arrayValues: Array<string> = [];

    constructor() {
        super();
        this.#shadow.append(this.#styles);
    }

    setTemplate(templateStringOrNode: string | Node) {
        const template = document.createDocumentFragment();

        if (templateStringOrNode instanceof Node) {
            template.appendChild(templateStringOrNode);
        } else {
            const parser = new DOMParser();
            const parsedTemplate = parser.parseFromString(templateStringOrNode, 'text/html');

            parsedTemplate.body.childNodes.forEach((child) => {
                template.appendChild(child);
            });
        }

        this.#shadow.append(template);
    }

    resetShadow(keepStyle = true) {
        removeChildNodes(this.#shadow, keepStyle ? ['STYLE'] : []);
    }

    getShadow() {
        return this.#shadow;
    }

    setStyle(styles: string) {
        this.#styles.textContent = styles;
    }

    getStyle() {
        return this.#styles.textContent;
    }

    addArrayValues(arrayValues: Array<string> | string) {
        const values = Array.isArray(arrayValues) ? arrayValues : [arrayValues];

        this.#arrayValues = [...this.#arrayValues, ...values];
    }

    removeArrayValues(arrayValues: Array<string> | string) {
        this.#arrayValues = this.#arrayValues.filter(v => Array.isArray(arrayValues) ? arrayValues.includes(v) : v === v);
    }

    getArrayValues() {
        return this.#arrayValues;
    }

    isArrayValue(value: string) {
        return this.#arrayValues.includes(value);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    attributeChangedCallback(property: string, oldValue: any, newValue: any) {
        const value = this.isArrayValue(property) ? newValue.split(',') : newValue;

        if (oldValue === value) {
            return;
        }

        this[property as keyof this] = value;
    }
}

export default CustomElement;
