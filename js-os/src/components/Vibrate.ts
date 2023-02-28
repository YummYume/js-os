import htmlTemplate from '@templates/components/Vibrate.html?raw';

import CustomElement from '@/CustomElement';
import { removeChildNodes } from '@utils/removeChildNodes';
import { isNull } from '@utils/tools';

class Vibrate extends CustomElement {
  template = this.getShadow();

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
  }

  async connectedCallback() {
    if (typeof navigator.vibrate === 'function') {
      this.changeIcon();
      window.addEventListener('storage', this.onSettingChange.bind(this));
    }
  }

  onSettingChange() {
    const vibrateStatus = this.template.querySelector('#current-vibrate-status');
    const vibrateSet = localStorage.getItem('vibrate');

    if (isNull(vibrateSet) || !vibrateStatus) return;

    this.changeIcon();
  }

  changeIcon() {
    const vibrateStatus = this.template.querySelector('#current-vibrate-status');
    const vibrateIcons = this.template.querySelector('#vibrate-icons');
    const vibrateSet = localStorage.getItem('vibrate');

    if (!vibrateStatus || !vibrateIcons || !(vibrateIcons instanceof HTMLTemplateElement) || !vibrateSet) {
      return;
    }

    const vibrateOnIcon = vibrateIcons.content.querySelector('#vibrate-on');
    const vibrateOffIcon = vibrateIcons.content.querySelector('#vibrate-off');

    removeChildNodes(vibrateStatus);

    if (vibrateSet === 'true') {
      if (vibrateOnIcon) {
        vibrateStatus.append(vibrateOnIcon.cloneNode(true));
      }
    } else {
      if (vibrateOffIcon) {
        vibrateStatus.append(vibrateOffIcon.cloneNode(true));
      }
    }
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this.onSettingChange.bind(this));
  }
}

export default Vibrate;
