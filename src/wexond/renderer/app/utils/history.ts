import { translate } from '~/renderer/app/utils/translate';
import * as moment from 'moment';

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
      prefix = `${translate('Today')} - `;
    } else if (current.getDate() - 1 === date.getDate()) {
      prefix = `${translate('Yesterday')} - `;
    }
  }

  return `${prefix}${moment(date).format('LLLL')}`;
};

export const formatTime = (date: Date) => {
  return `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};
