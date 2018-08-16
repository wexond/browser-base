import { observable } from 'mobx';
import { NewsStore } from './news';
import { WeatherStore } from './weather';

export class Store {
  public newsStore = new NewsStore();
  public weatherStore = new WeatherStore();
}
