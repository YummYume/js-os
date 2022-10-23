class CustomElement extends HTMLElement {
    #shadow = this.attachShadow({ mode : 'closed' });
    #template = document.createDocumentFragment();
    #styles = document.createElement('style');
    #isArrayValue: Array<string> = [];

    constructor() {
        super();
        this.#shadow.append(this.#styles);
    }

    setTemplate(templateStringOrNode: string | Node) {
        this.#template = document.createDocumentFragment();

        if (templateStringOrNode instanceof Node) {
            this.#template.append(templateStringOrNode);

            return;
        }

        const parser = new DOMParser();
        const template =  parser.parseFromString(templateStringOrNode, 'text/html');

        template.body.childNodes.forEach((child) => {
            this.#template.appendChild(child);
        });
    }

    getTemplate(): DocumentFragment {
        return this.#template;
    }

    appendToShadow(nodeOrString: string | Node) {
        this.#shadow.append(nodeOrString);
    }

    resetShadow(keepStyle = true) {
        const nodes = [...this.#shadow.childNodes];

        nodes.forEach((child) => {
            if (keepStyle && child.nodeName === 'STYLE') {
                return;
            }

            this.#shadow.removeChild(child);
        });
    }

    setStyle(styles: string) {
        this.#styles.textContent = styles;
    }

    getStyle() {
        return this.#styles.textContent;
    }

    addArrayValues(arrayValues: Array<string> | string) {
        const values = Array.isArray(arrayValues) ? arrayValues : [arrayValues];

        this.#isArrayValue = [...this.#isArrayValue, ...values];
    }

    removeArrayValues(arrayValues: Array<string> | string) {
        this.#isArrayValue = this.#isArrayValue.filter(v => Array.isArray(arrayValues) ? arrayValues.includes(v) : v === v);
    }

    getArrayValues() {
        return this.#isArrayValue;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    attributeChangedCallback(property: string, oldValue: any, newValue: any) {
        const value = this.#isArrayValue.includes(property) ? newValue.split(',') : newValue;

        if (oldValue === value) {
            return;
        }

        this[property as keyof this] = value;
    }
}

export default CustomElement;
