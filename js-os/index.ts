import App from '@templates/App.html?raw';

import Calculator from '@/applications/Calculator';
import Battery from '@/components/Battery';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';

customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);
customElements.define('calculator-app', Calculator);

const node = document.createElement('div');

document.body.appendChild(node);

node.insertAdjacentHTML('beforebegin', App);
node.remove();

window.addEventListener('open-app', (e) => {
  if (e instanceof CustomEvent) {
    alert(e.detail);
  } 
});

const loading = document.querySelector('#loading');

if (loading) {
  loading.remove();
}
