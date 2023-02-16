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
  lastPosition: { x: string, y: string } = { x: '0%', y: '0%' };

  // window
  windowDiv: HTMLElement | null = null;

  // toolbar window
  windowToolbar: HTMLElement | null = null;
  buttonClose: HTMLButtonElement | null = null;
  buttonScreen: HTMLButtonElement | null = null;
  buttonStash: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  connectedCallback() {
    const template = this.getShadow();

    this.windowDiv = template.querySelector('.window');
    this.windowToolbar = template.querySelector('.window-toolbar');
    this.buttonClose = template.querySelector('[data-close]');
    this.buttonScreen = template.querySelector('[data-screen]');
    this.buttonStash = template.querySelector('[data-stash]');

    if (this.windowDiv && this.windowDiv instanceof HTMLDivElement) {
      this.buttonClose?.addEventListener('click', this.close.bind(this));
      this.buttonScreen?.addEventListener('click', this.screen.bind(this));
      this.buttonStash?.addEventListener('click',  this.stash.bind(this));

      window.addEventListener('select-window', this.lastSelected.bind(this));

      this.windowToolbar?.addEventListener('mousedown', this.handleMouseDown);
      this.windowToolbar?.addEventListener('mousemove', this.handleMouseMove);
      this.windowToolbar?.addEventListener('mouseup', this.handleMouseUp);
      this.windowToolbar?.addEventListener('touchstart', this.handleMouseDown);
      this.windowToolbar?.addEventListener('touchmove', this.handleMouseMove);
      this.windowToolbar?.addEventListener('touchend', this.handleMouseUp);
    }

    this.runApp();
  }

  disconnectedCallback() {
    if (!this.windowDiv) return;

    this.buttonClose?.removeEventListener('click', this.close);
    this.buttonScreen?.removeEventListener('click', this.screen);
    this.buttonStash?.removeEventListener('click', this.stash);

    window.removeEventListener('select-window', this.lastSelected);

    this.windowToolbar?.removeEventListener('mousedown', this.handleMouseDown);
    this.windowToolbar?.removeEventListener('mousemove', this.handleMouseMove);
    this.windowToolbar?.removeEventListener('mouseup', this.handleMouseUp);
    this.windowToolbar?.removeEventListener('touchstart', this.handleMouseDown);
    this.windowToolbar?.removeEventListener('touchmove', this.handleMouseMove);
    this.windowToolbar?.removeEventListener('touchend', this.handleMouseUp);

    this.stopApp();
  }

  // Event for closing the app
  close() {
    this.eventDispatcher('close-window');
  }

  // Event for stashing the app
  stash() {
    this.eventDispatcher('stash-window');
  }

  // Event when the window is selected
  select() {
    this.eventDispatcher('select-window');
  }

  eventDispatcher(event: string) {
    window.dispatchEvent(new CustomEvent<ApplicationEventProps>(event, { detail: { name: this.name } })); 
  }

  // Place in first plan the last selected window
  private lastSelected(e: Event) {
    if (!this.windowDiv) return;

    if (e instanceof CustomEvent) {
      const event = e as CustomEvent<ApplicationEventProps>;
      if (event.detail.name === this.name) {
        this.windowDiv.style.zIndex = '1';
      } else {
        this.windowDiv.style.zIndex = '0';
      }
    }
  }

  // Swap fullscreen and windowed mode
  private screen() {
    if (!this.windowDiv) return;

    if (this.buttonScreen) {
      this.select();
      
      if (this.windowDiv.classList.contains('fullscreen')) {
        this.windowDiv.classList.replace('fullscreen', 'windowed');
        this.buttonScreen.textContent = '◻';
        this.resetPosition(this.lastPosition.x, this.lastPosition.y);
      } else {
        if (this.windowDiv.classList.contains('windowed')) {
          this.windowDiv.classList.replace('windowed', 'fullscreen');
          this.buttonScreen.textContent = '⧉';
          this.lastPosition = { x: this.windowDiv.style.left, y: this.windowDiv.style.top };
          this.resetPosition();
        }
      }
    }
  }

  private resetPosition (x = '0%', y = '0%') {
    if (!this.windowDiv) return;

    this.windowDiv.style.left = x;
    this.windowDiv.style.top = y;
  }

  private handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv) return;

    if (e.target !== e.currentTarget) return;

    if (this.windowDiv.classList.contains('fullscreen')) return;

    this.select();

    if (e instanceof MouseEvent && e.button !== 0) return;

    const event = e instanceof MouseEvent ? e : e.touches[0];

    this.x = event.clientX - this.windowDiv.getBoundingClientRect().left;
    this.y = event.clientY - this.windowDiv.getBoundingClientRect().top;
    this.moving = true;
  };

  private handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv) return;

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
