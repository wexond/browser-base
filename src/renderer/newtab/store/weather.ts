import { observable } from 'mobx';

export class WeatherStore {
  @observable
  public weatherForecast: WeatherForecast;
}
