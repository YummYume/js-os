import styles from '@styles/components/Calculator.scss';
import htmlTemplate from '@templates/components/Calculator.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Calculator extends Application implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  #pivotNumber = ''; 
  #numbers: NodeListOf<Element> | [] = [];
  #operators: NodeListOf<Element> | [] = [];
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
    this.#result = template.querySelector('[data-calc="result"]');
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
          if (this.#result.textContent.length <= 15)
            this.#result.textContent = this.#result.textContent + event.target.dataset.calcNumber;
        }
      }
    }
  }

  callOperator(event: Event) {
    if (event.target instanceof HTMLButtonElement) {
      switch (event.target.dataset.calcOperator) {
        case 'clear':
          if (this.#result) {
            this.#result.textContent = '';
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
