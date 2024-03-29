import htmlTemplate from '@templates/components/Network.html?raw';

import CustomElement from '@/CustomElement';
import { removeChildNodes } from '@utils/removeChildNodes';
import { isNull } from '@utils/tools';

class Network extends CustomElement {
  template = this.getShadow();

  #networkInformation: NetworkInformation | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
  }

  async connectedCallback() {
    this.#networkInformation = navigator.connection;
    this.onNetworkChange();

    window.addEventListener('storage', this.networkSetting.bind(this));
    this.addEvent();
  }

  networkSetting() {
    const networkStatus = this.template.querySelector('#current-network-status');
    const networkSet = localStorage.getItem('network');

    if (isNull(networkSet) || !networkStatus) return;

    this.removeEvent();

    if (networkSet !== 'true') {
      networkStatus.textContent = '';
    } else {
      this.onNetworkChange();
      this.addEvent();
    }
  }

  disconnectedCallback() {
    this.removeEvent();
  }

  addEvent() {
    if (this.#networkInformation) {
      this.#networkInformation.addEventListener('change', this.onNetworkChange.bind(this), false);
    }
  }

  removeEvent() {
    if (this.#networkInformation) {
      this.#networkInformation.removeEventListener('change', this.onNetworkChange.bind(this), false);
    }
  }

  onNetworkChange() {
    const networkIcons = this.template.querySelector('#network-icons');
    const networkStatus = this.template.querySelector('#current-network-status');

    if (this.#networkInformation && networkIcons && networkIcons instanceof HTMLTemplateElement && networkStatus) {
      removeChildNodes(networkStatus);

      if (this.#networkInformation.type === 'cellular') {
        const networkNoneIcon = networkIcons.content.querySelector('#network-none');
        const networkLowIcon = networkIcons.content.querySelector('#network-low');
        const networkAverageIcon = networkIcons.content.querySelector('#network-average');
        const networkHighIcon = networkIcons.content.querySelector('#network-high');
        const networkVeryHighIcon = networkIcons.content.querySelector('#network-very-high');

        if (this.#networkInformation.effectiveType === 'slow-2g') {
          if (this.#networkInformation.downlink < 1 && networkNoneIcon) {
            networkStatus.append(networkNoneIcon.cloneNode(true));
          } else if (networkLowIcon) {
            networkStatus.append(networkLowIcon.cloneNode(true));
          }
        } else if (this.#networkInformation.effectiveType === '2g') {
          if (networkAverageIcon) {
            networkStatus.append(networkAverageIcon.cloneNode(true));
          }
        } else if (this.#networkInformation.effectiveType === '3g') {
          if (networkHighIcon) {
            networkStatus.append(networkHighIcon.cloneNode(true));
          }
        } else {
          if (networkVeryHighIcon) {
            networkStatus.append(networkVeryHighIcon.cloneNode(true));
          }
        }
      } else if (this.#networkInformation.type === 'ethernet') {
        const ethernetIcon = networkIcons.content.querySelector('#ethernet');

        if (ethernetIcon) {
          networkStatus.append(ethernetIcon.cloneNode(true));
        }
      } else {
        const wifiNoneIcon = networkIcons.content.querySelector('#wifi-none');
        const wifiLowIcon = networkIcons.content.querySelector('#wifi-low');
        const wifiAverageIcon = networkIcons.content.querySelector('#wifi-average');
        const wifiHighIcon = networkIcons.content.querySelector('#wifi-high');

        if (['slow-2g', '2g'].includes(this.#networkInformation.effectiveType)) {
          if (this.#networkInformation.downlink < 1 && wifiNoneIcon) {
            networkStatus.append(wifiNoneIcon.cloneNode(true));
          } else if (wifiLowIcon) {
            networkStatus.append(wifiLowIcon.cloneNode(true));
          }
        } else if (this.#networkInformation.effectiveType === '3g') {
          if (wifiAverageIcon) {
            networkStatus.append(wifiAverageIcon.cloneNode(true));
          }
        } else if (this.#networkInformation.effectiveType === '4g') {
          if (wifiHighIcon) {
            networkStatus.append(wifiHighIcon.cloneNode(true));
          }
        }
      }
    }
  }
}

export default Network;
