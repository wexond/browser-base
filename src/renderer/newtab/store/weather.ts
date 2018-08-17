import { observable } from 'mobx';
import { WeatherForecast } from '../interfaces';

export class WeatherStore {
  @observable
  public weatherForecast: WeatherForecast;
}
