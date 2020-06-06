import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

export const randomId = () => uuidv4();

export const makeGuuid = () => uuidv1();

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
