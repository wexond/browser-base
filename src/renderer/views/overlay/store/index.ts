import { observable, computed } from 'mobx';

import { getTheme } from '~/utils/themes';

export class Store {
  @computed
  public get theme() {
    return getTheme('wexond-light');
  }
}

export default new Store();
