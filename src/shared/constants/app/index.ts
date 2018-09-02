export * from './add-tab-options';
export * from './commands';
export * from './databases';
export * from './design';

export const NEWTAB_URL =
  process.env.ENV === 'dev'
    ? 'http://localhost:8080/newtab.html'
    : 'wexond://newtab';
