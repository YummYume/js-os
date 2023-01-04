import styles from '@styles/Window.scss';
import htmlTemplate from '@templates/Window.html?raw';

import CustomElement from '@/CustomElement';

import APPLICATION from '../constants/application';

import type { ApplicationEventProps, Application as ApplicationType } from 'types/application';

class Application extends CustomElement implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  width = 50;

  height = 50;

  x = 0;

  y = 0;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  async connectedCallback() {
    const template = this.getShadow();
    const windowDiv = template.querySelector('.window');

    if (windowDiv && windowDiv instanceof HTMLDivElement) {
      windowDiv.style.width = this.width.toString();
      windowDiv.style.height = this.height.toString();
    }
  }

  close() {
    this.dispatchEvent(new CustomEvent<ApplicationEventProps>('app-closed', { detail: { name: this.name } }));
    this.remove();
  }
}

export default Application;
