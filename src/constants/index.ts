export * from './api-ipc-messages';
export * from './ipc-messages';
export * from './api-keys';
export * from './design';

export const NEWTAB_URL =
  process.env.ENV === 'dev'
    ? 'http://localhost:8080/newtab.html'
    : 'wexond://newtab';
