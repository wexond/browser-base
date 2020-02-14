import { loadAsync } from 'jszip';
import { join, dirname } from 'path';
import { promises } from 'fs';

export const extractZip = async (zipBuf: Buffer, destination: string) => {
  const zip = await loadAsync(zipBuf);
  const zipFileKeys = Object.keys(zip.files);

  return Promise.all(
    zipFileKeys.map((filename: string) => {
      const isFile = !zip.files[filename].dir;
      const fullPath = join(destination, filename);
      const directory = (isFile && dirname(fullPath)) || fullPath;
      const content = zip.files[filename].async('nodebuffer');

      return promises
        .mkdir(directory, { recursive: true })
        .then(async () => {
          return isFile ? await content : false;
        })
        .then(async (data: any) => {
          return data ? await promises.writeFile(fullPath, data) : true;
        });
    }),
  );
};
