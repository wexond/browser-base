import { promises } from 'fs';
import { promisify } from 'util';
import { join, resolve, dirname, basename, extname } from 'path';

const jszip = require('jszip');
const mkdirp = require('mkdirp');

const mkdir = promisify(mkdirp);

function calcLength(a: number, b: number, c: number, d: number) {
  let length = 0;
  length += a << 0;
  length += b << 8;
  length += c << 16;
  length += (d << 24) >>> 0;
  return length;
}

function crxToZip(buf: Buffer) {
  // 50 4b 03 04
  // This is actually a zip file
  if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4) {
    return buf;
  }

  // 43 72 32 34 (Cr24)
  if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
    throw new Error('Invalid header: Does not start with Cr24');
  }

  // 02 00 00 00
  if ((buf[4] !== 2 && buf[4] !== 3) || buf[5] || buf[6] || buf[7]) {
    throw new Error('Unexpected crx format version number.');
  }

  let zipStartOffset;
  let publicKeyLength;
  let signatureLength;
  if (buf[4] === 2) {
    publicKeyLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
    signatureLength = calcLength(buf[12], buf[13], buf[14], buf[15]);
    // 16 = Magic number (4), CRX format version (4), lengths (2x4)
    zipStartOffset = 16 + publicKeyLength + signatureLength;
  } else {
    // view[4] === 3
    // CRX3 - https://cs.chromium.org/chromium/src/components/crx_file/crx3.proto
    const crx3HeaderLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
    // 12 = Magic number (4), CRX format version (4), header length (4)
    zipStartOffset = 12 + crx3HeaderLength;
  }

  // 16 = Magic number (4), CRX format version (4), lengths (2x4)
  zipStartOffset = 16 + publicKeyLength + signatureLength;

  return buf.slice(zipStartOffset, buf.length);
}

export const extractCrx = (crxFilePath: string, destination: string) => {
  const filePath = resolve(crxFilePath);
  const ext = extname(crxFilePath);
  const base = basename(crxFilePath, ext);
  const dir = dirname(crxFilePath);

  destination = destination || resolve(dir, base);
  return promises
    .readFile(filePath)
    .then((buf: Buffer) => {
      return jszip.loadAsync(crxToZip(buf));
    })
    .then((zip: any) => {
      const zipFileKeys = Object.keys(zip.files);

      return Promise.all(
        zipFileKeys.map((filename: string) => {
          const isFile = !zip.files[filename].dir;
          const fullPath = join(destination, filename);
          const directory = (isFile && dirname(fullPath)) || fullPath;
          const content = zip.files[filename].async('nodebuffer');

          return mkdir(directory)
            .then(() => {
              return isFile ? content : false;
            })
            .then((data: any) => {
              return data ? promises.writeFile(fullPath, data) : true;
            });
        }),
      );
    });
};
