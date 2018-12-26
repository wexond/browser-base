import './scss/index.scss';
import { TabsStore } from './tabs';

export class App {
  public tabs = new TabsStore();

  public mouse = {
    x: 0,
    y: 0,
  };
}

export default new App();
