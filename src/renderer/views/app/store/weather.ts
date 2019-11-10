import { observable } from 'mobx';

import { IForecast } from '~/interfaces';
import { getWeather } from '../utils/weather';

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
