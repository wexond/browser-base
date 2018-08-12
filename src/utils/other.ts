export const isObject = (item: any) => typeof item === 'object';

export const merge = (
  target: any,
  source: any,
  onlyNotExisting = false,
): any => {
  target = { ...target };

  if (source == null) {
    return target;
  }

  source = { ...source };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: string) => {
      if (isObject(source[key])) {
        target[key] = merge(target[key], source[key], onlyNotExisting);
      } else if (
        !onlyNotExisting ||
        (target[key] == null || target[key] === '')
      ) {
        target[key] = source[key];
      }
    });
  }

  return target;
};

export const capitalizeWord = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const capitalizeEachWord = (str: string) => {
  const splited = str.split(' ');

  for (let i = 0; i < splited.length; i++) {
    splited[i] = splited[i][0].toUpperCase() + splited[i].substring(1);
  }

  return splited.join(' ');
};

export const makeId = (
  length: number,
  possible: string = 'abcdefghijklmnopqrstuvwxyz',
) => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return id;
};

export const compareArrays = (first: any, second: any) => {
  if (first.length !== second.length) {
    return false;
  }

  for (let i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) {
      return false;
    }
  }

  return true;
};
