import { WeatherForecast } from '../interfaces';
import { capitalizeEachWord } from './other';
import { getDayIndex, formatTime } from './time';
import { newtabStore } from '../renderer/newtab-store';

export const formatDescription = (forecast: WeatherForecast, index: number) => {
  const dictionary = newtabStore.dictionary.dateAndTime;
  const { timeUnit, daily } = forecast;
  const { description, date } = daily[index];
  const dayName = dictionary.daysShort[getDayIndex(date)];

  return `${dayName}, ${formatTime(date, timeUnit)}, ${capitalizeEachWord(
    description,
  )}`;
};
