import styles from '@styles/components/Calculator.scss';
import htmlTemplate from '@templates/components/Calculator.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Calculator extends Application implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  #numbers: NodeListOf<Element> | [] = [];
  #operators: NodeListOf<Element> | [] = [];

  #pivotNumber = 0; 
  #previousResult: HTMLElement | null = null;
  #result: HTMLElement | null = null;

  constructor() {
    super();
    this.appendStyle(styles);
    this.setupApp({
      cbRun: this.run.bind(this),
      cbStop: this.stop.bind(this),
    });
  }

  run() {
    const template = this.getShadow();
    this.windowDiv = template.querySelector('.window');

    if (this.windowDiv) {
      const contentWindow = this.windowDiv.lastElementChild;
      const appTemplate = this.convertStringToNode(htmlTemplate);

      if (contentWindow && appTemplate) {
        contentWindow.appendChild(appTemplate);
        this.calculate(this.windowDiv);
      }
    }
  }

  calculate(template: Element) {
    this.#previousResult = template.querySelector('.previous-input');
    this.#result = template.querySelector('.current-input');
    this.#numbers = template.querySelectorAll('[data-calc-number]');
    this.#operators = template.querySelectorAll('[data-calc-operator]');

    this.#numbers.forEach((number) => {
      number.addEventListener('click', this.callNumber.bind(this));
    });
    this.#operators.forEach((number) => {
      number.addEventListener('click', this.callOperator.bind(this));
    });
  }

  callNumber(event: Event) {
    if (event.target instanceof HTMLButtonElement) {
      if (this.#result) {
        if (!this.#result.textContent) {
          this.#result.textContent = '' + event.target.dataset.calcNumber;
        } else {
          if (this.#result.textContent.length <= 15) {
            if (this.#result.textContent === '0') {
              this.#result.textContent = '';
            }
            this.#result.textContent = this.#result.textContent + event.target.dataset.calcNumber;
          }
        }
      }
    }
  }

  callOperator(event: Event) {
    const template = this.getShadow();

    if (event.target instanceof HTMLButtonElement && this.#result && this.#result.textContent) {
      const currentSelect = template.querySelector('[data-calc-select]');
      const result = parseInt(this.#result.textContent);

      switch (event.target.dataset.calcOperator) {
        case 'clear':
          this.#result.textContent = '0';
          if (this.#previousResult) {
            this.#previousResult.textContent = '';
          }
          break;
        case 'del':
          this.#result.textContent = this.#result.textContent.slice(0, -1);
          break;
        case 'switch-sign':
          if (!isNaN(result)) {
            this.#result.textContent = `${result !== 0 ? -1 * result : 0}`;
          }
          break;
        case 'equal':
          if (currentSelect) currentSelect.removeAttribute('data-calc-select');
          if (this.#previousResult) {
            this.#previousResult.textContent = this.#result.textContent;
            this.#result.textContent = '0';
          }
          break;
        case 'dot':
          if (!this.#result.textContent.includes('.')) {
            this.#result.textContent = `${this.#result.textContent}.`;
          } 
          break;
        case 'add':
        case 'subtract':
        case 'divide':
        case 'multiply':
        case 'percent':
          if (!isNaN(result)) {
            this.#pivotNumber = result;
            if (currentSelect) currentSelect.removeAttribute('data-calc-select');
            event.target.setAttribute('data-calc-select', '');
          }
          break;
      }
    }
  }

  stop() {
    this.#numbers.forEach((number) => {
      number.removeEventListener('click', this.callNumber);
    });
    this.#operators.forEach((number) => {
      number.addEventListener('click', this.callOperator);
    });
  }
}

export default Calculator;
