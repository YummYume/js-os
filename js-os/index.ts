import App from '@templates/App.html?raw';

import Calculator from '@/applications/Calculator';
import Tictactoe from '@/applications/Tictactoe';
import Battery from '@/components/Battery';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';
import { getApplication } from '@constants/application';

import type { ApplicationComponent, ApplicationEventProps } from '@defs/application';

customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);
customElements.define('calculator-app', Calculator);
customElements.define('tictactoe-app', Tictactoe);

const node = document.createElement('div');
const applications: ApplicationComponent[] = [];

document.body.appendChild(node);

node.insertAdjacentHTML('beforebegin', App);
node.remove();

const root = document.body.querySelector('#root');

if (!root) {
  throw new Error('Element #root not found.');
}

window.addEventListener('open-app', (e) => {
  if (e instanceof CustomEvent) {
    const event = e as CustomEvent<ApplicationEventProps>;
    const application = getApplication(event.detail.name);

    if (application && !applications.includes(application.component)) {
      const applicationComponent = document.createElement(application.component);

      root.append(applicationComponent);
      applications.push(application.component);
    }
  }
});

window.addEventListener('close-app', (e) => {
  if (e instanceof CustomEvent) {
    const event = e as CustomEvent<ApplicationEventProps>;
    const application = getApplication(event.detail.name);

    if (application && applications.length > 0) {
      applications.forEach((app, key) => {
        const appDom = document.querySelector(app);
        if (appDom) {
          if (application.component === appDom.localName) {
            appDom.remove();
            applications.splice(key, 1);
          }
        }
      });
    }
  }
});

const loading = document.querySelector('#loading');

if (loading) {
  loading.remove();
}
