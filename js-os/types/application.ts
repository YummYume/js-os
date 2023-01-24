export type ApplicationName = 'calculator';

export type ApplicationComponent = 'calculator-app';

export interface Application {
  name: ApplicationName;

  x: number;

  y: number;

  moving: boolean;

  close: () => void;
}

export interface ApplicationList {
  [key: string]: {
    name: ApplicationName,
    component: ApplicationComponent,
    icon: string
  }
}

export interface ApplicationEventProps {
  name: ApplicationName;
}
