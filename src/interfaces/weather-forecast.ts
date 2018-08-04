import { WeatherWeeklyItem, WeatherDailyItem } from '.';
import { Locales, TimeUnit, TemperatureUnit } from '../enums';

export interface WeatherForecast {
  tempUnit?: TemperatureUnit;
  timeUnit?: TimeUnit;
  lang?: Locales;
  daily?: WeatherDailyItem[];
  weekly?: WeatherWeeklyItem[];
  city?: string;
  windsUnit?: string;
}
