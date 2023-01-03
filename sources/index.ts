import Battery from '@/components/Battery';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';

customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);

// TODO : add a loading screen till all this file is loaded
