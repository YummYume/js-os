import styles from '@styles/applications/Calculator.scss';
import htmlTemplate from '@templates/applications/Calculator.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

type Operator = 'add' | 'subtract' | 'divide' | 'multiply';

class Calculator extends Application implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  #numbers: NodeListOf<Element> | [] = [];

  #operators: NodeListOf<Element> | [] = [];

  #pivotNumber = 0;

  #isActiveOperator = false;

  #previousResult: HTMLElement | null = null;

  #result: HTMLElement | null = null;

  constructor() {
    super();
    // Append with Application Style
    this.appendStyle(styles);
    // Setup lifeCycle
    this.setupApp({
      cbRun: this.run.bind(this),
      cbStop: this.stop.bind(this),
    });
  }

  // Mount: add all event listener
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

  // Didmount: remove all event listener
  stop() {
    this.#numbers.forEach((number) => {
      number.removeEventListener('click', this.callNumber);
    });
    this.#operators.forEach((number) => {
      number.addEventListener('click', this.callOperator);
    });
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

  // When a digit is use
  callNumber(event: Event) {
    if (event.target instanceof HTMLButtonElement && this.#result) {
      if (this.#isActiveOperator) {
        this.#result.textContent = '';
        this.#isActiveOperator = false;
      }

      if (!this.#result.textContent) {
        this.#result.textContent = '' + event.target.dataset.calcNumber;
      } else {
        if (this.#result.textContent.length < 14) {
          if (this.#result.textContent === '0') {
            this.#result.textContent = '';
          }
          this.#result.textContent = this.#result.textContent + event.target.dataset.calcNumber;
        }
      }
    }
  }

  // When an operator is use
  callOperator(event: Event) {
    const template = this.getShadow();

    if (event.target instanceof HTMLButtonElement && this.#result && this.#result.textContent) {
      const currentSelect = template.querySelector<HTMLElement>('[data-calc-select]');
      const result = parseFloat(this.#result.textContent);

      switch (event.target.dataset.calcOperator) {
        case 'clear':
          if (currentSelect) currentSelect.removeAttribute('data-calc-select');
          if (this.#previousResult) this.#previousResult.textContent = '';
          this.#result.textContent = '0';
          break;
        case 'del':
          if (this.#result.textContent === '0') {
            this.#result.textContent = '0';
          } else {
            this.#result.textContent = this.#result.textContent.slice(0, -1);
          }
          break;
        case 'switch-sign':
          if (!isNaN(result)) this.#result.textContent = `${result !== 0 ? -1 * result : 0}`;
          break;
        case 'dot':
          if (!this.#result.textContent.includes('.')) {
            this.#result.textContent = `${this.#result.textContent}.`;
          }
          break;
        case 'percent':
          if (!isNaN(result)) this.#result.textContent = `${this.mumberInPow(result / 100)}`;
          break;
        case 'equal':
          if (currentSelect && currentSelect.dataset.calcOperator) {
            if (this.#previousResult) {
              if (!isNaN(result)) {
                const value = this.getOperation(this.#pivotNumber, result, currentSelect.dataset.calcOperator as Operator);
                this.#previousResult.textContent = `${ typeof value === 'string' ? value : this.mumberInPow(value)}`;
              }
              this.#result.textContent = '0';
            }
            currentSelect.removeAttribute('data-calc-select');
          }
          break;
        case 'add':
        case 'subtract':
        case 'divide':
        case 'multiply':
          if (!isNaN(result)) {
            this.#isActiveOperator = true;
            if (currentSelect) {
              currentSelect.removeAttribute('data-calc-select');
            } else {
              this.#pivotNumber = result;
            }
            event.target.setAttribute('data-calc-select', '');
          }
          break;
      }
    }
  }

  getOperation(a: number, b: number, operator: Operator) {
    return {
      add: a + b,
      subtract: a - b,
      divide: b !== 0 ? a / b : 'Error',
      multiply: a * b,
    }[operator];
  }

  mumberInPow(num: number) {
    if (num.toString().length > 12) {
      return num.toExponential(3);
    }
    return num;
  }
}

export default Calculator;
