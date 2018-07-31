import { TemperatureUnit, TimeUnit, WeatherLanguages } from '../../shared/enums';
import WeatherDailyItem from './weather-daily-item';
import WeatherWeeklyItem from './weather-weekly-item';

export default interface WeatherForecast {
  tempUnit?: TemperatureUnit;
  timeUnit?: TimeUnit;
  lang?: WeatherLanguages;
  daily?: WeatherDailyItem[];
  weekly?: WeatherWeeklyItem[];
  city?: string;
  windsUnit?: string;
} // eslint-disable-line
