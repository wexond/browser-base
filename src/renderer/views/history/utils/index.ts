import { daysList, monthsList } from '~/renderer/constants/dictionary';

export const compareDates = (first: Date, second: Date) => {
  return (
    first != null &&
    second != null &&
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const getSectionLabel = (date: Date) => {
  let prefix = '';
  const current = new Date();

  if (
    date.getFullYear() === current.getFullYear() &&
    date.getMonth() === current.getMonth()
  ) {
    if (current.getDate() === date.getDate()) {
      prefix = 'Today - ';
    } else if (current.getDate() - 1 === date.getDate()) {
      prefix = 'Yesterday - ';
    }
  }

  return `${prefix}${daysList[date.getDay()]}, ${
    monthsList[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatTime = (date: Date) => {
  return `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
