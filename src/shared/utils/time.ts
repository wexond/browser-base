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

export const formatDate = (date: Date) => {
  date = new Date();
  const currentDate = new Date();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let prefix = '';

  if (date.getDate() === currentDate.getDate()) {
    prefix = 'Today - ';
  } else if (date.getDate() === currentDate.getDate() - 1) {
    prefix = 'Yesterday - ';
  }

  const dayName = getDay(days, date);
  const monthName = months[date.getMonth()];

  return `${prefix}${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
};
