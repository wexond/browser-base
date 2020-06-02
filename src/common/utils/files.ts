import { stat } from 'fs';

export const pathExists = (path: string) => {
  return new Promise((resolve) => {
    stat(path, (error) => {
      resolve(!error);
    });
  });
};
