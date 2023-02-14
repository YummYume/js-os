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
  buttonClose: HTMLButtonElement | null = null;
  buttonScreen: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  connectedCallback() {
    const template = this.getShadow();

    this.windowDiv = template.querySelector('.window');
    this.buttonClose = template.querySelector('[data-close]');
    this.buttonScreen = template.querySelector('[data-screen]');

    if (this.windowDiv && this.windowDiv instanceof HTMLDivElement) {
      this.buttonClose?.addEventListener('click', this.close.bind(this));
      this.buttonScreen?.addEventListener('click', this.screen.bind(this));
      this.windowDiv.addEventListener('mousedown', this.handleMouseDown);
      this.windowDiv.addEventListener('mousemove', this.handleMouseMove);
      this.windowDiv.addEventListener('mouseup', this.handleMouseUp);
      this.windowDiv.addEventListener('touchstart', this.handleMouseDown);
      this.windowDiv.addEventListener('touchmove', this.handleMouseMove);
      this.windowDiv.addEventListener('touchend', this.handleMouseUp);
    }

    this.runApp();
  }

  disconnectedCallback() {
    if (!this.windowDiv) {
      return;
    }

    this.buttonClose?.removeEventListener('click', this.close);
    this.buttonScreen?.removeEventListener('click', this.screen);
    this.windowDiv.removeEventListener('mousedown', this.handleMouseDown);
    this.windowDiv.removeEventListener('mousemove', this.handleMouseMove);
    this.windowDiv.removeEventListener('mouseup', this.handleMouseUp);
    this.windowDiv.removeEventListener('touchstart', this.handleMouseDown);
    this.windowDiv.removeEventListener('touchmove', this.handleMouseMove);
    this.windowDiv.removeEventListener('touchend', this.handleMouseUp);

    this.stopApp();
  }

  close() {
    window.dispatchEvent(new CustomEvent<ApplicationEventProps>('close-app', { detail: { name: this.name } }));
  }

  screen() {
    if (!this.windowDiv) {
      return;
    }

    if (this.buttonScreen) {
      if (this.windowDiv.classList.contains('fullscreen')) {
        this.windowDiv.classList.replace('fullscreen', 'windowed');
        this.buttonScreen.textContent = '◻';
        this.resetPosition('25', '25');
      } else {
        if (this.windowDiv.classList.contains('windowed')) {
          this.windowDiv.classList.replace('windowed', 'fullscreen');
          this.buttonScreen.textContent = '⧉';
          this.resetPosition();
        }
      }
    }
  }

  resetPosition (x = '0', y = '0') {
    if (!this.windowDiv) {
      return;
    }

    this.windowDiv.style.left = `${x}%`;
    this.windowDiv.style.top = `${y}%`;
  }

  private handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv) {
      return;
    }

    if (this.windowDiv.classList.contains('fullscreen')) {
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
