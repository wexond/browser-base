import { observable } from 'mobx';
import { WeatherForecast } from '../interfaces/weather-forecast';

const dictionary = require('../../static/dictionaries/english-en.json');

class NewtabStore {
  @observable
  public newsColumns: any[] = [];

  @observable
  public newsData: any[] = [];

  @observable
  public weatherForecast: WeatherForecast;

  public dictionary: any = dictionary;
}

export const newtabStore = new NewtabStore();
