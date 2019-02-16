export const isURL = (input: string): boolean => {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(input)) {
    return true;
  }
  return pattern.test(`http://${input}`);
};
