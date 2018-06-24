export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const capitalizeFirstLetterInEachWord = (str: string) => {
  const splited = str.split(' ');

  for (let i = 0; i < splited.length; i++) {
    splited[i] = splited[i][0].toUpperCase() + splited[i].substring(1);
  }

  return splited.join(' ');
};
