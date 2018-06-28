import { TimeUnit } from '../enums';

export const getTimeWithZero = (time: number) => (time < 10 ? `0${time}` : time);

export const getTimePeriod = (hours: number, timeUnit: TimeUnit) => {
  if (timeUnit === TimeUnit.TwelveHours) {
    return hours > 12 ? ' PM' : ' AM';
  }
  return '';
};

export const getTime = (
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

  const _hours = getTimeWithZero(hours);
  const _minutes = minutes ? getTimeWithZero(date.getMinutes()) : '';

  return `${_hours}${minutes ? ':' : ''}${_minutes}${timePeriod}`;
};

export const getDay = (days: any, date: Date) => {
  const index = date.getDay() === 0 ? days.length - 1 : date.getDay() - 1;
  return days[index];
};

export const getTimeOffset = (date: Date) => {
  const currentdate = new Date();
  const diff = new Date(currentdate.getTime() - date.getTime());

  const hours = diff.getHours() - 1;
  const minutes = diff.getMinutes();

  if (hours === 0) {
    if (minutes <= 1) return 'a minute ago';
    return `${minutes} minutes ago`;
  }

  if (hours === 1) return 'an hour ago';
  return `${hours} hours ago`;
};
