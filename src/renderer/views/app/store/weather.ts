import { observable } from 'mobx';

import { getWeather } from '../utils';
import { IForecast } from '~/interfaces';

export class WeatherStore {
  @observable
  public data: IForecast = {};

  @observable
  public loading = true;

  public constructor() {
    this.load();
  }

  public async load() {
    // TODO: info from settings
    this.data = await getWeather({
      city: 'warsaw',
      lang: 'en',
      units: 'metric',
    });

    this.loading = false;
  }
}
