import { observable } from 'mobx';
import WeatherForecast from './models/weather-forecast';

class store {
  // Observables
  @observable weatherForecast: WeatherForecast;

  @observable contentVisible: boolean = false;

  @observable columns: any = [];

  @observable newsData: any[];
}

export default new store();
