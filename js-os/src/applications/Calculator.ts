import Application from '@/Application';
import APPLICATION from '@constants/application';

import type { Application as ApplicationType } from 'types/application';

class Calculator extends Application implements ApplicationType {
  name = APPLICATION.CALCULATOR.name;
}

export default Calculator;
