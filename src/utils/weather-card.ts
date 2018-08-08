import { capitalizeEachWord, formatTime, getDayIndex } from '.';
import { WeatherForecast } from '../interfaces';
import store from '../renderer/store';

export const formatDescription = (forecast: WeatherForecast, index: number) => {
  const dictionary = store.dictionary.dateAndTime;
  const { timeUnit, daily } = forecast;
  const { description, date } = daily[index];
  const dayName = dictionary.daysShort[getDayIndex(date)];

  return `${dayName}, ${formatTime(date, timeUnit)}, ${capitalizeEachWord(description)}`;
};
