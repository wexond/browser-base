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
