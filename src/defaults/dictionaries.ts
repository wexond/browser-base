const locales = ['en-US', 'pl-PL'];
const localeBaseName = 'en-US';

const localeBase = require(`../../static/dictionaries/${localeBaseName}.json`);

export const getDictionary = (name: string) => {
  if (name === localeBaseName) return localeBase;

  const locale = require(`../../static/dictionaries/${name}.json`);
  return Object.assign({}, localeBase, locale);
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
