import Battery from '@/components/Battery';
import Coordinator from '@/components/Coordinator';
import Network from '@/components/Network';
import TaskBar from '@/components/TaskBar';

customElements.define('os-coordinator', Coordinator);
customElements.define('task-bar', TaskBar);
customElements.define('battery-icon', Battery);
customElements.define('network-icon', Network);
