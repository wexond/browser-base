import { observable } from 'mobx';

import { getWeather } from '../utils';
import { Forecast } from '~/interfaces';

export class WeatherStore {
  @observable
  public data: Forecast = {};

  @observable
  public loading = true;

  constructor() {
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
