import wexond from './wexond';
import wexondError from './wexond-error';

export const protocols =
  process.env.NODE_ENV === 'development'
    ? [wexondError]
    : [wexondError, wexond];
