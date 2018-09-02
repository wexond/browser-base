export const locales = ['en-US', 'pl-PL'];
export const localeBaseName = 'en-US';

export const localeBase = require(`../../static/dictionaries/${localeBaseName}.json`);

export const getDictionary = (name: string) => {
  if (name === localeBaseName) return localeBase;

  const locale = require(`../../static/dictionaries/${name}.json`);
  return {
    ...localeBase,
    ...locale,
  };
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
