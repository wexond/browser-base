import GlobalStore from '../../global-store';
import WeatherForecast from '../models/weather-forecast';
import { getDayIndex, formatTime } from '../../shared/utils/time';
import { capitalizeEachWord } from '../../shared/utils/strings';

export const formatDescription = (forecast: WeatherForecast, index: number) => {
  const dictionary = GlobalStore.dictionary.dateAndTime;
  const { timeUnit, daily } = forecast;
  const { description, date } = daily[index];
  const dayName = dictionary.daysShort[getDayIndex(date)];

  return `${dayName}, ${formatTime(date, timeUnit)}, ${capitalizeEachWord(description)}`;
};
