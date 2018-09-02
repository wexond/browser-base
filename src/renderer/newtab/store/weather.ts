import { observable } from 'mobx';

import { WeatherForecast } from '@/interfaces/newtab';

export class WeatherStore {
  @observable
  public forecast: WeatherForecast;
}
