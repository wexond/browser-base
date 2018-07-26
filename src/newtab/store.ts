import { observable } from 'mobx';
import WeatherForecast from './models/weather-forecast';

class Store {
  // Observables
  @observable weatherForecast: WeatherForecast;

  @observable contentVisible: boolean = false;

  @observable columns: any = [];

  @observable newsData: any[];
}

export default new Store();
