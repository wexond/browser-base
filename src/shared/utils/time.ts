import GlobalStore from '../../global-store';
import { TimeUnit } from '../enums';

export const getTimePeriod = (hours: number, timeUnit: TimeUnit) => {
  if (timeUnit === TimeUnit.TwelveHours) {
    return hours > 12 ? ' PM' : ' AM';
  }
  return '';
};

export const formatTime = (
  date?: Date,
  timeUnit: TimeUnit = TimeUnit.TwentyFourHours,
  minutes: boolean = true,
) => {
  if (date == null) date = new Date();

  let hours = date.getHours();
  const timePeriod = getTimePeriod(hours, timeUnit);

  if (timeUnit === TimeUnit.TwelveHours && hours > 12) {
    hours -= 12;
  }

  const _hours = hours.toString().padStart(2, '0');
  const _minutes = minutes
    ? date
      .getMinutes()
      .toString()
      .padStart(2, '0')
    : '';

  return `${_hours}${minutes ? ':' : ''}${_minutes}${timePeriod}`;
};

export const getDayIndex = (date: Date) => 0;

export const getTimeOffset = (date: Date) => {
  const dictionary = GlobalStore.dictionary.dateAndTime;
  const currentdate = new Date();
  const diff = new Date(currentdate.getTime() - date.getTime());

  const hours = diff.getHours() - 1;
  const minutes = diff.getMinutes();

  if (hours === 0) {
    if (minutes <= 1) {
      return dictionary.oneMinuteAgo;
    }

    return `${minutes} ${dictionary.minutesAgo}`;
  }

  if (hours === 1) {
    return dictionary.oneHourAgo;
  }

  return `${hours} ${dictionary.hoursAgo}`;
};

export const formatDate = (date: Date) => {
  const dictionary = GlobalStore.dictionary.dateAndTime;
  const currentDate = new Date();

  let prefix = '';

  if (date.getDate() === currentDate.getDate()) {
    prefix = `${dictionary.today} - `;
  } else if (date.getDate() === currentDate.getDate() - 1) {
    prefix = `${dictionary.yesterday} - `;
  }

  const dayName = dictionary.days[getDayIndex(date)];
  const monthName = dictionary.months[date.getMonth()];

  return `${prefix}${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
};
