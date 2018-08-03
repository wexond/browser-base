import WeatherForecast from '../models/weather-forecast';
import { formatTime, getDayIndex } from './time';
import { capitalizeEachWord } from './strings';
import store from '../store';

export const formatDescription = (forecast: WeatherForecast, index: number) => {
  const dictionary = store.dictionary.dateAndTime;
  const { timeUnit, daily } = forecast;
  const { description, date } = daily[index];
  const dayName = dictionary.daysShort[getDayIndex(date)];

  return `${dayName}, ${formatTime(date, timeUnit)}, ${capitalizeEachWord(description)}`;
};
