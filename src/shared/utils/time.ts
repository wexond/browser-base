import { TimeUnit } from '../enums';

export const getTimeWithZero = (time: number) => (time < 10 ? `0${time}` : time);

export const getActualTime = (timeUnit: TimeUnit = TimeUnit.am) => {
  const date = new Date();
  let hours = date.getHours();

  if (timeUnit === TimeUnit.pm) hours -= 12;

  return `${getTimeWithZero(hours)}:${getTimeWithZero(date.getMinutes())}`;
};

export const getDay = (days: any, date: Date) => {
  const index = date.getDay() === 0 ? days.length - 1 : date.getDay() - 1;
  return days[index];
};
