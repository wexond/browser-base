import { observable, computed } from 'mobx';

import { dictionaries } from '@/constants/dictionaries';
import { NewsStore } from './news';
import { WeatherStore } from './weather';

export class Store {
  public newsStore = new NewsStore();
  public weatherStore = new WeatherStore();

  @observable
  public locale: string = 'en-US';

  @computed
  get dictionary() {
    return dictionaries[this.locale];
  }
}

export default new Store();
