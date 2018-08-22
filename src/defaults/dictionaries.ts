const locales = ['en-US', 'pl-PL'];

const getDictionary = (name: string) => {
  return require(`../../static/dictionaries/${name}.json`);
};

export const dictionaries: { [key: string]: any } = {};
locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
