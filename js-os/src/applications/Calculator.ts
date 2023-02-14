import styles from '@styles/components/Calculator.scss';
import htmlTemplate from '@templates/components/Calculator.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Calculator extends Application implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;
  #numbers: NodeListOf<Element> | [] = [];

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
    this.#numbers = template.querySelectorAll('[data-calc-number]');
    this.#numbers.forEach((number) => {
      number.addEventListener('click', this.callNumber);
    });
  }

  callNumber(event: Event) {
    if (event.target instanceof HTMLButtonElement) {
      //console.log(event.target.dataset.calcNumber);
    }
  }

  stop() {
    this.#numbers.forEach((number) => {
      number.removeEventListener('click', this.callNumber);
    });
  }
}

export default Calculator;
