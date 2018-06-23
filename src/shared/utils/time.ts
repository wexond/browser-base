import { TimeUnit } from '../enums';

export const getActualTime = (timeUnit: TimeUnit = TimeUnit.AM) => {
  const date = new Date();
  let hours = date.getHours();

  if (timeUnit === TimeUnit.PM) {
    hours = 24 - hours;
  }

  return `${hours}:${date.getMinutes()}`;
};
