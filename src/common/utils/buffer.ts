export const bufferFromUint8Array = (array: Uint8Array) => {
  return Buffer.from(new Uint8Array(array));
};
