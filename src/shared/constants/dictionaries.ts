import { readFileSync } from 'fs';

export const locales = ['en-US', 'pl-PL'];
export const localeBaseName = 'en-US';

const localeBase = JSON.parse(
  readFileSync(`./static/dictionaries/${localeBaseName}.json`, 'utf8'),
);

export const getDictionary = (name: string) => {
  if (name === localeBaseName) return localeBase;

  const locale = JSON.parse(
    readFileSync(`./static/dictionaries/${name}.json`, 'utf8'),
  );

  return {
    ...localeBase,
    ...locale,
  };
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
