import App from '@templates/App.html?raw';

import Calculator from '@/applications/Calculator';
import Clock from '@/applications/Clock';
import Settings from '@/applications/Settings';
import Tictactoe from '@/applications/Tictactoe';
import Battery from '@/components/Battery';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';
import Vibrate from '@/components/Vibrate';
import { getApplication } from '@constants/application';
import { isNull } from '@utils/tools';

import imgUrl from './assets/default_wallpaper.jpg';

import type { ApplicationComponent, ApplicationEventProps } from '@defs/application';

customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);
customElements.define('vibrate-icon', Vibrate);
customElements.define('calculator-app', Calculator);
customElements.define('tictactoe-app', Tictactoe);
customElements.define('settings-app', Settings);
customElements.define('clock-app', Clock);

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

const desktop = root.querySelector('#desktop');

if (!desktop) {
  throw new Error('Element #desktop in element #root not found.');
}

const background = document.createElement('img');
background.src = imgUrl;
background.loading = 'lazy';
background.alt = 'Desktop wallpaper';

desktop.appendChild(background);

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

window.addEventListener('toast', (e) => {
  const toast = document.querySelector('.toast');
  if (!toast) return;

  const toastMessage = toast.querySelector('.toast-message');
  if (!toastMessage) return;

  if (e instanceof CustomEvent) {
    const event = e as CustomEvent<{ message: string }>;
    toastMessage.textContent = event.detail.message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});

const loading = document.querySelector('#loading');

if (loading) {
  loading.remove();
}
