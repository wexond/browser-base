export interface ForecastRequest {
  city: string,
  lang: string;
  units: 'metric' | 'imperial',
}

export interface ForecastItem {
  name?: string;
  dayTemp: number;
  nightTemp?: number;
  description: string;
  weather: string;
}

export interface Forecast {
  today: ForecastItem;
  items: ForecastItem[],
}
