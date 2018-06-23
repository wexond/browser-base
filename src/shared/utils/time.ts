import { TimeUnit } from '../enums';

export const getActualTime = (timeUnit: TimeUnit = TimeUnit.AM) => {
  const date = new Date();
  let hours = date.getHours();

  if (timeUnit === TimeUnit.PM) {
    hours -= 12;
  }

  return `${hours}:${date.getMinutes()}`;
};
