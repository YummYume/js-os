import { removeChildNodes } from '@utils/removeChildNodes';
import Singleton from '@utils/singleton';

type callback = () => void;

class CustomElement extends HTMLElement {
  #shadow = this.attachShadow({ mode : 'closed' });

  #styles = document.createElement('style');

  #arrayValues: string[] = [];

  #run: callback[] = [];

  #stop: callback[] = [];

  constructor() {
    super();
    this.#shadow.append(this.#styles);
  }

  setTemplate(templateStringOrNode: string | Node) {
    const template = document.createDocumentFragment();

    if (templateStringOrNode instanceof Node) {
      template.appendChild(templateStringOrNode);
    } else {
      const parser = Singleton.getInstance<DOMParser>(DOMParser);
      const parsedTemplate = parser.parseFromString(templateStringOrNode, 'text/html');

      parsedTemplate.body.childNodes.forEach((child) => {
        template.appendChild(child);
      });
    }

    this.#shadow.append(template);
  }

  convertStringToNode(templateString: string): ChildNode | null {
    let template: ChildNode | null = null;

    const parser = Singleton.getInstance<DOMParser>(DOMParser);
    const { body: { childNodes } } = parser.parseFromString(templateString.trim(), 'text/html');
    childNodes.forEach((child) => {
      template = child;
    });

    return template;
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

  appendStyle(styles: string) {
    this.#styles.textContent = `${this.#styles.textContent} ${styles}`;
  }

  getStyle() {
    return this.#styles.textContent;
  }

  addArrayValues(arrayValues: string[] | string) {
    const values = Array.isArray(arrayValues) ? arrayValues : [arrayValues];

    this.#arrayValues = [...this.#arrayValues, ...values];
  }

  removeArrayValues(arrayValues: string[] | string) {
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

  setupApp({ cbRun, cbStop }: { cbRun?: callback, cbStop?: callback }) {
    this.#run = cbRun ? [...this.#run, cbRun] : this.#run;
    this.#stop = cbStop ? [...this.#stop, cbStop] : this.#stop;
  }

  runApp() {
    this.#run.forEach((callback) => {
      callback();
    });
  }

  stopApp() {
    this.#stop.forEach((callback) => {
      callback();
    });
  }
}

export default CustomElement;
