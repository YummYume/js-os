import htmlTemplate from '@templates/components/Battery.html?raw';

import CustomElement from '@/CustomElement';
import { removeChildNodes } from '@utils/removeChildNodes';
import { isNull } from '@utils/tools';

class Battery extends CustomElement {
  template = this.getShadow();

  #batteryManager: BatteryManager | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
  }

  async connectedCallback() {
    if (typeof navigator.getBattery === 'function') {
      this.#batteryManager = await navigator.getBattery();
      this.onBatteryChange();
    }

    window.addEventListener('storage', this.batterySetting.bind(this));
    this.addEvent();
  }

  batterySetting() {
    const batteryStatus = this.template.querySelector('#current-battery-status');
    const batterySet = localStorage.getItem('battery');

    if (isNull(batterySet) || !batteryStatus) return;

    this.removeEvent();

    if (batterySet !== 'true') {
      batteryStatus.textContent = '';
    } else {
      this.onBatteryChange();
      this.addEvent();
    }
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this.batterySetting.bind(this));
    this.removeEvent();
  }

  addEvent() {
    if (this.#batteryManager) {
      this.#batteryManager.addEventListener('chargingchange', this.onBatteryChange.bind(this), false);
      this.#batteryManager.addEventListener('levelchange', this.onBatteryChange.bind(this), false);
    }
  }

  removeEvent() {
    if (this.#batteryManager) {
      this.#batteryManager.removeEventListener('chargingchange', this.onBatteryChange.bind(this), false);
      this.#batteryManager.removeEventListener('levelchange', this.onBatteryChange.bind(this), false);
    }
  }

  onBatteryChange() {
    const batteryIcons = this.template.querySelector('#battery-icons');
    const batteryStatus = this.template.querySelector('#current-battery-status');

    if (batteryIcons && batteryIcons instanceof HTMLTemplateElement && batteryStatus) {
      const batteryEmptyIcon = batteryIcons.content.querySelector('#battery-empty');
      const batteryHalfIcon = batteryIcons.content.querySelector('#battery-half');
      const batteryFullIcon = batteryIcons.content.querySelector('#battery-full');
      const batteryChargingIcon = batteryIcons.content.querySelector('#battery-charging');

      removeChildNodes(batteryStatus);

      if (this.#batteryManager) {
        if (this.#batteryManager.charging) {
          if (batteryChargingIcon) {
            batteryStatus.append(batteryChargingIcon.cloneNode(true));
          }
        } else {
          const level = this.#batteryManager.level;

          if (level <= 0.1) {
            if (batteryEmptyIcon) {
              batteryStatus.append(batteryEmptyIcon.cloneNode(true));
            }
          } else if (level <= 0.5) {
            if (batteryHalfIcon) {
              batteryStatus.append(batteryHalfIcon.cloneNode(true));
            }
          } else {
            if (batteryFullIcon) {
              batteryStatus.append(batteryFullIcon.cloneNode(true));
            }
          }
        }
      }
    }
  }
}

export default Battery;
