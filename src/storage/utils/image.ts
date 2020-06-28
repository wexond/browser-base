import * as icojs from 'icojs';

import { bufferFromUint8Array } from '~/common/utils/buffer';

export const convertIcoToPng = async (icoData: Buffer) => {
  return bufferFromUint8Array(
    new Uint8Array((await icojs.parse(icoData, 'image/png'))[0].buffer),
  );
};
