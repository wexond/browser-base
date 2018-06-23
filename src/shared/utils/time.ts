import { TimeUnit } from '../enums';

export const getTimeWithZero = (time: number) => (time < 10 ? `0${time}` : time);

export const getActualTime = (timeUnit: TimeUnit = TimeUnit.AM) => {
  const date = new Date();
  let hours = date.getHours();

  if (timeUnit === TimeUnit.PM) hours -= 12;

  return `${getTimeWithZero(hours)}:${getTimeWithZero(date.getMinutes())}`;
};
