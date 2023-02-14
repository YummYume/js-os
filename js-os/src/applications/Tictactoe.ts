import styles from '@styles/components/Tictactoe.scss';
import htmlTemplate from '@templates/components/Tictactoe.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Tictactoe extends Application implements ApplicationType {
  name = APPLICATION.TICTACTOE.name;

  constructor() {
    super();
    this.appendStyle(styles);
    this.setupApp({
      cbRun: this.run.bind(this),
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
      }
    }
  }
}

export default Tictactoe;
