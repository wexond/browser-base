import { stat, promises as fs } from 'fs';

export const pathExists = (path: string) => {
  return new Promise((resolve) => {
    stat(path, (error) => {
      resolve(!error);
    });
  });
};

export const readJsonFile = async <T>(
  path: string,
  defaultDataPath: string,
): Promise<T> => {
  const exists = await pathExists(path);
  const data: any = await fs
    .readFile(exists ? path : defaultDataPath, 'utf8')
    .then((r) => JSON.parse(r));

  if (!exists) {
    await fs.writeFile(path, data, 'utf8');
  }

  return data;
};
