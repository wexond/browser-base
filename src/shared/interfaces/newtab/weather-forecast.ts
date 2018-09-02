import { WeatherDailyItem, WeatherWeeklyItem } from '.';

export interface WeatherForecast {
  tempUnit?: 'C' | 'F';
  timeUnit?: 24 | 12;
  lang?: string;
  daily?: WeatherDailyItem[];
  weekly?: WeatherWeeklyItem[];
  city?: string;
  windsUnit?: string;
}
