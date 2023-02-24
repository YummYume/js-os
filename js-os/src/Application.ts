import styles from '@styles/Window.scss';
import htmlTemplate from '@templates/Window.html?raw';

import CustomElement from '@/CustomElement';
import APPLICATION from '@constants/application';
import BREAKPOINTS from '@constants/breakpoints';

import type { ApplicationEventProps, Application as ApplicationType } from 'types/application';

class Application extends CustomElement implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;

  x = 0;

  y = 0;

  moving = false;

  lastPosition: { x: string, y: string } = { x: '0%', y: '0%' };

  lastSize: { width: string, height: string } = { width: '25rem', height: '25rem' };

  // window
  windowDiv: HTMLElement | null = null;

  // toolbar window
  windowToolbar: HTMLElement | null = null;

  // window content
  windowContent: HTMLElement | null = null;

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
    this.windowContent = template.querySelector('.window-content');
    this.buttonClose = template.querySelector('[data-close]');
    this.buttonScreen = template.querySelector('[data-screen]');
    this.buttonStash = template.querySelector('[data-stash]');

    if (this.windowDiv && this.windowDiv instanceof HTMLDivElement) {
      this.buttonClose?.addEventListener('click', this.close.bind(this), false);
      this.buttonScreen?.addEventListener('click', this.screen.bind(this), false);
      this.buttonStash?.addEventListener('click',  this.stash.bind(this), false);

      window.addEventListener('select-window', this.lastSelected.bind(this), false);

      this.windowDiv.addEventListener('mousedown', this.select.bind(this), false);

      this.windowToolbar?.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
      this.windowToolbar?.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
      this.windowToolbar?.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
      this.windowToolbar?.addEventListener('touchstart', this.handleMouseDown.bind(this), false);
      this.windowToolbar?.addEventListener('touchmove', this.handleMouseMove.bind(this), false);
      this.windowToolbar?.addEventListener('touchend', this.handleMouseUp.bind(this), false);
    }

    const appNameHolder = this.windowToolbar?.querySelector('span.window-toolbar_appname');

    if (appNameHolder) {
      appNameHolder.textContent = this.name;
    }

    if (this.windowDiv) {
      this.windowDiv.style.zIndex = '1';
    }

    this.runApp();
  }

  disconnectedCallback() {
    if (!this.windowDiv) return;

    this.buttonClose?.removeEventListener('click', this.close.bind(this), false);
    this.buttonScreen?.removeEventListener('click', this.screen.bind(this), false);
    this.buttonStash?.removeEventListener('click', this.stash.bind(this), false);

    window.removeEventListener('select-window', this.lastSelected.bind(this), false);

    this.windowDiv.removeEventListener('mousedown', this.select.bind(this), false);

    this.windowToolbar?.removeEventListener('mousedown', this.handleMouseDown.bind(this), false);
    this.windowToolbar?.removeEventListener('mousemove', this.handleMouseMove.bind(this), false);
    this.windowToolbar?.removeEventListener('mouseup', this.handleMouseUp.bind(this), false);
    this.windowToolbar?.removeEventListener('touchstart', this.handleMouseDown.bind(this), false);
    this.windowToolbar?.removeEventListener('touchmove', this.handleMouseMove.bind(this), false);
    this.windowToolbar?.removeEventListener('touchend', this.handleMouseUp.bind(this), false);

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
      const maximizeIcon = this.buttonScreen.querySelector('svg#screen-maximize-icon');
      const minimizeIcon = this.buttonScreen.querySelector('svg#screen-minimize-icon');

      if (this.windowDiv.classList.contains('fullscreen')) {
        this.windowDiv.classList.replace('fullscreen', 'windowed');
        this.buttonScreen.ariaLabel = 'Enter fullscreen';

        if (minimizeIcon && minimizeIcon instanceof SVGElement) {
          minimizeIcon.style.display = 'none';
          minimizeIcon.style.visibility = 'hidden';
        }

        if (maximizeIcon && maximizeIcon instanceof SVGElement) {
          maximizeIcon.style.display = 'initial';
          maximizeIcon.style.visibility = 'visible';
        }

        this.resetPosition(this.lastPosition.x, this.lastPosition.y, this.lastSize.width, this.lastSize.height);
      } else {
        if (this.windowDiv.classList.contains('windowed')) {
          this.windowDiv.classList.replace('windowed', 'fullscreen');
          this.buttonScreen.ariaLabel = 'Exit fullscreen';

          if (maximizeIcon && maximizeIcon instanceof SVGElement) {
            maximizeIcon.style.display = 'none';
            maximizeIcon.style.visibility = 'hidden';
          }

          if (minimizeIcon && minimizeIcon instanceof SVGElement) {
            minimizeIcon.style.display = 'initial';
            minimizeIcon.style.visibility = 'visible';
          }

          this.lastPosition = { x: this.windowDiv.style.left, y: this.windowDiv.style.top };
          this.lastSize = { width: this.windowDiv.style.width, height: this.windowDiv.style.height };
        }
      }
    }
  }

  private resetPosition (x = '0%', y = '0%', width = '100dvw', height = '94dvh') {
    if (!this.windowDiv) return;

    this.windowDiv.style.left = x;
    this.windowDiv.style.top = y;
    this.windowDiv.style.width = width;
    this.windowDiv.style.height = height;
  }

  private handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!this.windowDiv || window.screen.width < BREAKPOINTS.MOBILE) return;

    if (e.target !== e.currentTarget) return;

    if (this.windowDiv.classList.contains('fullscreen')) return;

    if (e instanceof MouseEvent && e.button !== 0) return;

    const event = e instanceof MouseEvent ? e : e.touches[0];

    this.x = event.clientX - this.windowDiv.getBoundingClientRect().left;
    this.y = event.clientY - this.windowDiv.getBoundingClientRect().top;
    this.moving = true;
    document.body.style.userSelect = 'none';
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
    document.body.style.userSelect = 'initial';
  };
}

export default Application;
