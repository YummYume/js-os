import CustomElement from '@/CustomElement';
import APPLICATION from 'constants/application';
import type { ApplicationEventProps, Application as ApplicationType } from 'types/application';

class Application extends CustomElement implements ApplicationType {
  name = APPLICATION.CALCULATOR;

  width = 50;

  height = 50;

  x = 0;

  y = 0;

  close() {
    this.dispatchEvent(new CustomEvent<ApplicationEventProps>('app-closed', { detail: { name: this.name } }));
    this.remove();
  }
}

export default Application;
