class CustomElement extends HTMLElement {
    #shadow = this.attachShadow({ mode : 'closed' });
    #template = document.createDocumentFragment();
    #styles = document.createElement('style');

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
}

export default CustomElement;
