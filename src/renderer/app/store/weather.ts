import { getWeather } from '~/renderer/app/utils';

export class WeatherStore {
  constructor() {
    this.load();
  }

  public async load() {
    await getWeather({
      city: 'opole',
      lang: 'pl',
      units: 'metric'
    });
  }
}
