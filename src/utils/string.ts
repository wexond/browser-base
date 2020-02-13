export const makeId = (
  length: number,
  possible = 'abcdefghijklmnopqrstuvwxyz',
) => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return id;
};

export const replaceAll = (
  str: string,
  find: string,
  replace: string,
  options = 'gi',
) => {
  find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  return str.replace(new RegExp(find, options), replace);
};

export const capitalizeFirst = (str: string) => {
  return str.substr(0, 1).toUpperCase() + str.substring(1).toLowerCase();
};

export const hashCode = (str: string) => {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
