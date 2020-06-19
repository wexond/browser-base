import * as icojs from 'icojs';

export const convertIcoToPng = async (icoData: Buffer) => {
  return Buffer.from(
    new Uint8Array((await icojs.parse(icoData, 'image/png'))[0].buffer),
  );
};
