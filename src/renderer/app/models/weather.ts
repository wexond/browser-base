export interface ForecastRequest {
  city: string,
  lang: string;
  units: 'metric' | 'imperial',
}

export interface ForecastItem {
  date?: Date;
  dayName?: string;
  dayTemp?: number;
  nightTemp?: number;
  description?: string;
  weather?: WeatherCondition;
}

export interface Forecast {
  today?: ForecastItem;
  week?: ForecastItem[];
}

export type WeatherCondition = 'clear' | 'few-clouds' | 'rain' | 'showers' | 'snow' | 'storm';

/* tslint:disable */
export interface OpenWeatherItem {
  clouds: {
    all: number;
  },
  dt: number;
  dt_txt: string;
  main: {
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_kf: number;
    temp_max: number;
    temp_min: number;
  },
  sys: {
    pod: 'd' | 'n';
  }
  weather: {
    description: string;
    icon: string;
    id: number;
    main: WeatherCondition
  }[],
  wind: {
    deg: number;
    speed: number;
  }
}
/* tslint:enable */
