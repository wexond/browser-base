import { loadAsync } from 'jszip';
import { join, dirname } from 'path';
import * as mkdirp from 'mkdirp';
import { promisify } from 'util';
import { promises } from 'fs';

const mkdir = promisify(mkdirp);

export const extractZip = async (zipBuf: Buffer, destination: string) => {
  const zip = await loadAsync(zipBuf);
  const zipFileKeys = Object.keys(zip.files);

  return Promise.all(
    zipFileKeys.map((filename: string) => {
      const isFile = !zip.files[filename].dir;
      const fullPath = join(destination, filename);
      const directory = (isFile && dirname(fullPath)) || fullPath;
      const content = zip.files[filename].async('nodebuffer');

      return mkdir(directory)
        .then(async () => {
          return isFile ? await content : false;
        })
        .then(async (data: any) => {
          return data ? await promises.writeFile(fullPath, data) : true;
        });
    }),
  );
};
