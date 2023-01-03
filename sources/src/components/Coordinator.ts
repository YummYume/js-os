import CustomElement from '@/CustomElement';
import TaskBar from '@/components/TaskBar';

import htmlTemplate from '@templates/components/Coordinator.html?raw';
import styles from '@styles/components/Coordinator.scss';
import Application from '@/Application';

class Coordinator extends CustomElement {
  #applications: Application[] = [];
  #taskBar: TaskBar | null = null;

  constructor() {
    super();
    this.setTemplate(htmlTemplate);
    this.setStyle(styles);
  }

  connectedCallback() {
    const template = this.getShadow();
    const taskBarContainer = template.querySelector('header#task-bar');

    if (taskBarContainer) {
      this.#taskBar = document.createElement('task-bar') as TaskBar;
      taskBarContainer.append(this.#taskBar);

      this.#taskBar.setAttribute('items', 'item1,item2');
    }
  }

  getApplications() {
    return this.#applications;
  }

  setApplications(applications: Array<Application>) {
    this.#applications = applications;
  }

  addApplication(application: Application) {
    this.#applications = [...this.#applications, application];
  }

  remoteApplication(application: Application) {
    this.#applications = this.#applications.filter(a => a !== application);
  }
}

export default Coordinator;
