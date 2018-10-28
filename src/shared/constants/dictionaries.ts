import * as localeBase from '../../shared/resources/dictionaries/en-US.json';

console.log(localeBase);

export const locales = ['en-US', 'pl-PL'];
export const localeBaseName = 'en-US';

export const getDictionary = (name: string) => {
  if (name === localeBaseName) return localeBase;

  const locale = JSON.parse(
    // readFileSync(`./static/dictionaries/${name}.json`, 'utf8'),
    '{}',
  );

  return {
    ...localeBase,
    ...locale,
  };
};

export const dictionaries: { [key: string]: any } = { 'en-US': localeBase };
// locales.forEach(locale => (dictionaries[locale] = getDictionary(locale)));
