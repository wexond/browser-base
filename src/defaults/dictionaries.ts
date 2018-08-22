import { Dictionary } from '~/interfaces';

const localeBase = 'en-US';
const locales = ['en-US', 'pl-PL'];

const getDictionary = (name: string) => {
  const defaultLocale = require(`../../static/dictionaries/${localeBase}.json`);
  const locale = require(`../../static/dictionaries/${name}.json`);

  return Object.assign(defaultLocale, locale) as Dictionary;
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
