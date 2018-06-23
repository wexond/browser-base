export const isObject = (item: any) => typeof item === 'object';

export const merge = (target: any, source: any, onlyNotExisting = false): any => {
  target = { ...target };

  if (source == null) {
    return target;
  }

  source = { ...source };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: string) => {
      if (isObject(source[key])) {
        target[key] = merge(target[key], source[key], onlyNotExisting);
      } else if (!onlyNotExisting || (target[key] == null || target[key] === '')) {
        target[key] = source[key];
      }
    });
  }

  return target;
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const capitalizeFirstLetterInEachWord = (str: string) => {
  const splited = str.split(' ');

  for (let i = 0; i < splited.length; i++) {
    splited[i] = splited[i][0].toUpperCase() + splited[i].substring(1);
  }

  return splited.join(' ');
};
