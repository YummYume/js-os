import APPLICATION from 'constants/application';

export type ApplicationName = typeof APPLICATION[keyof typeof APPLICATION];

export interface Application {
  name: ApplicationName;

  width: number;

  height: number;

  x: number;

  y: number;

  close: () => void;
}

export interface ApplicationEventProps {
  name: ApplicationName;
}
