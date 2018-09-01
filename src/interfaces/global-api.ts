import { Dictionary, Favicon } from '~/interfaces';

export interface GlobalAPI extends NodeJS.Global {
  dictionary?: Dictionary;
  getHistory?: any;
}
