import App from '@templates/App.html?raw';

import Calculator from '@/applications/Calculator';
import Tictactoe from '@/applications/Tictactoe';
import Battery from '@/components/Battery';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';
import Settings from '@/applications/Settings';
import { getApplication } from '@constants/application';

import type { ApplicationComponent, ApplicationEventProps } from '@defs/application';
import { isNull } from '@utils/tools';

customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);
customElements.define('calculator-app', Calculator);
customElements.define('tictactoe-app', Tictactoe);
customElements.define('settings-app', Settings);

const node = document.createElement('div');
const applications: ApplicationComponent[] = [];

document.body.appendChild(node);

Settings.OPTIONS_AVAILABLE.forEach((option) => {
  const optionSet = localStorage.getItem(option);
  if (isNull(optionSet)) localStorage.setItem(option, `${true}`);
});

node.insertAdjacentHTML('beforebegin', App);
node.remove();

const root = document.body.querySelector('#root');

if (!root) {
  throw new Error('Element #root not found.');
}

window.addEventListener('open-window', (e) => {
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

window.addEventListener('stash-window', (e: Event) => {
  if (e instanceof CustomEvent) {
    const event = e as CustomEvent<ApplicationEventProps>;
    const application = getApplication(event.detail.name);
    if (application) {
      const appDom = document.querySelector(application.component);

      if (appDom && 'windowDiv' in appDom) {
        const windowDiv = appDom.windowDiv as HTMLElement;
        windowDiv.classList.contains('stash') ? windowDiv.classList.remove('stash') : windowDiv.classList.add('stash');
      }
    }
  }
});

window.addEventListener('close-window', (e) => {
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
