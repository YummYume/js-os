import styles from '@styles/Window.scss';
import htmlTemplate from '@templates/Window.html?raw';

import CustomElement from '@/CustomElement';
import APPLICATION from '@constants/application';

import type { ApplicationEventProps, Application as ApplicationType } from 'types/application';

class Application extends CustomElement implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  x = 0;

  y = 0;

  moving = false;

  windowDiv: HTMLElement | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  connectedCallback() {
    const template = this.getShadow();

    this.windowDiv = template.querySelector('.window');

    if (this.windowDiv && this.windowDiv instanceof HTMLDivElement) {
      this.windowDiv.addEventListener('mousedown', this.handleMouseDown);
      this.windowDiv.addEventListener('mousemove', this.handleMouseMove);
      this.windowDiv.addEventListener('mouseup', this.handleMouseUp);
      this.windowDiv.addEventListener('touchstart', this.handleMouseDown);
      this.windowDiv.addEventListener('touchmove', this.handleMouseMove);
      this.windowDiv.addEventListener('touchend', this.handleMouseUp);
    }
  }

  disconnectedCallback() {
    if (!this.windowDiv) {
      return;
    }

    this.windowDiv.removeEventListener('mousedown', this.handleMouseDown);
    this.windowDiv.removeEventListener('mousemove', this.handleMouseMove);
    this.windowDiv.removeEventListener('mouseup', this.handleMouseUp);
    this.windowDiv.removeEventListener('touchstart', this.handleMouseDown);
    this.windowDiv.removeEventListener('touchmove', this.handleMouseMove);
    this.windowDiv.removeEventListener('touchend', this.handleMouseUp);
  }

  close() {
    this.dispatchEvent(new CustomEvent<ApplicationEventProps>('app-closed', { detail: { name: this.name } }));
    this.remove();
  }

  private handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv) {
      return;
    }

    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    const event = e instanceof MouseEvent ? e : e.touches[0];

    this.x = event.clientX - this.windowDiv.getBoundingClientRect().left;
    this.y = event.clientY - this.windowDiv.getBoundingClientRect().top;
    this.moving = true;
  };

  private handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv) {
      return;
    }

    const event = e instanceof MouseEvent ? e : e.touches[0];

    if (this.moving) {
      this.windowDiv.style.left = `${event.pageX - this.x}px`;
      this.windowDiv.style.top = `${event.pageY - this.y}px`;
    }
  };

  private handleMouseUp = () => {
    this.moving = false;
  };
}

export default Application;
