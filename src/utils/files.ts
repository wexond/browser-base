import { DIRECTORIES, FILES } from '~/constants/files';
import { getPath } from '.';
import { mkdirSync, existsSync, writeFileSync, stat } from 'fs';

export const checkFiles = () => {
  for (const dir of DIRECTORIES) {
    const path = getPath(dir);
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }

  Object.keys(FILES).forEach((key) => {
    const defaultContent = (FILES as any)[key];
    const path = getPath(key);

    if (!existsSync(path)) {
      writeFileSync(path, JSON.stringify(defaultContent));
    }
  });
};

export const pathExists = (path: string) => {
  return new Promise((resolve) => {
    stat(path, (error) => {
      resolve(!error);
    });
  });
};
