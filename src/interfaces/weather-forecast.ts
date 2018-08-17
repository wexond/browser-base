import { WeatherDailyItem, WeatherWeeklyItem } from '.';
import { Locales } from '../enums';

export interface WeatherForecast {
  tempUnit?: 'C' | 'F';
  timeUnit?: 24 | 12;
  lang?: Locales;
  daily?: WeatherDailyItem[];
  weekly?: WeatherWeeklyItem[];
  city?: string;
  windsUnit?: string;
}
