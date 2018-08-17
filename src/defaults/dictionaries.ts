import { Dictionary } from '../interfaces';
import { readFileSync } from 'fs';

const locales = ['en-US', 'pl-PL'];

const getDictionary = (name: string) => {
  return JSON.parse(
    readFileSync(`../../static/dictionaries/${name}.json`, 'utf8'),
  );
};

export const dictionaries: { [key: string]: Dictionary } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
