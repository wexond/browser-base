import { readFileSync } from 'fs';

const locales = ['en-US', 'pl-PL'];

const getDictionary = (name: string) => {
  return JSON.parse(
    readFileSync(`../../static/dictionaries/${name}.json`, 'utf8'),
  );
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
