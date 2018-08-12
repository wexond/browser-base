import { WeatherDailyItem, WeatherWeeklyItem } from '.';
import { Locales, TemperatureUnit, TimeUnit } from '../enums';

export interface WeatherForecast {
  tempUnit?: TemperatureUnit;
  timeUnit?: TimeUnit;
  lang?: Locales;
  daily?: WeatherDailyItem[];
  weekly?: WeatherWeeklyItem[];
  city?: string;
  windsUnit?: string;
}
