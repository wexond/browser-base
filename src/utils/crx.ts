import { createHash } from 'crypto';

function calcLength(a: number, b: number, c: number, d: number) {
  let length = 0;
  length += a << 0;
  length += b << 8;
  length += c << 16;
  length += (d << 24) >>> 0;
  return length;
}

function getBinaryString(
  bytesView: Buffer,
  startOffset: number,
  endOffset: number,
) {
  let binaryString = '';
  for (let i = startOffset; i < endOffset; ++i) {
    binaryString += String.fromCharCode(bytesView[i]);
  }
  return binaryString;
}

function getPublicKeyFromProtoBuf(
  bytesView: Buffer,
  startOffset: number,
  endOffset: number,
) {
  // Protobuf definition: https://cs.chromium.org/chromium/src/components/crx_file/crx3.proto
  // Wire format: https://developers.google.com/protocol-buffers/docs/encoding
  // The top-level CrxFileHeader message only contains length-delimited fields (type 2).
  // To find the public key:
  // 1. Look for CrxFileHeader.sha256_with_rsa (field number 2).
  // 2. Look for AsymmetricKeyProof.public_key (field number 1).
  // 3. Look for CrxFileHeader.signed_header_data (SignedData.crx_id).
  //    This has 16 bytes (128 bits). Verify that those match with the
  //    first 128 bits of the sha256 hash of the chosen public key.

  function getvarint() {
    // Note: We don't do bound checks (startOffset < endOffset) here,
    // because even if we read past the end of bytesView, then we get
    // the undefined value, which is converted to 0 when we do a
    // bitwise operation in JavaScript.
    let val = bytesView[startOffset] & 0x7f;
    if (bytesView[startOffset++] < 0x80) return val;
    val |= (bytesView[startOffset] & 0x7f) << 7;
    if (bytesView[startOffset++] < 0x80) return val;
    val |= (bytesView[startOffset] & 0x7f) << 14;
    if (bytesView[startOffset++] < 0x80) return val;
    val |= (bytesView[startOffset] & 0x7f) << 21;
    if (bytesView[startOffset++] < 0x80) return val;
    val = (val | ((bytesView[startOffset] & 0xf) << 28)) >>> 0;
    if (bytesView[startOffset++] & 0x80) console.warn('proto: not a uint32');
    return val;
  }

  const publicKeys: string[] = [];
  let crxIdBin: Buffer | undefined;
  while (startOffset < endOffset) {
    const key = getvarint();
    const length = getvarint();
    if (key === 80002) {
      // This is ((10000 << 3) | 2) (signed_header_data).
      const sigdatakey = getvarint();
      const sigdatalen = getvarint();
      if (sigdatakey !== 0xa) {
        console.warn(
          'proto: Unexpected key in signed_header_data: ' + sigdatakey,
        );
      } else if (sigdatalen !== 16) {
        console.warn('proto: Unexpected signed_header_data length ' + length);
      } else if (crxIdBin) {
        console.warn('proto: Unexpected duplicate signed_header_data');
      } else {
        crxIdBin = bytesView.subarray(startOffset, startOffset + 16);
      }
      startOffset += sigdatalen;
      continue;
    }
    if (key !== 0x12) {
      // Likely 0x1a (sha256_with_ecdsa).
      if (key != 0x1a) {
        console.warn('proto: Unexpected key: ' + key);
      }
      startOffset += length;
      continue;
    }
    // Found 0x12 (sha256_with_rsa); Look for 0xA (public_key).
    const keyproofend = startOffset + length;
    let keyproofkey = getvarint();
    let keyprooflength = getvarint();
    // AsymmetricKeyProof could contain 0xA (public_key) or 0x12 (signature).
    if (keyproofkey === 0x12) {
      startOffset += keyprooflength;
      if (startOffset >= keyproofend) {
        // signature without public_key...? The protocol definition allows it...
        continue;
      }
      keyproofkey = getvarint();
      keyprooflength = getvarint();
    }
    if (keyproofkey !== 0xa) {
      startOffset += keyprooflength;
      console.warn(
        'proto: Unexpected key in AsymmetricKeyProof: ' + keyproofkey,
      );
      continue;
    }
    if (startOffset + keyprooflength > endOffset) {
      console.warn('proto: size of public_key field is too large');
      break;
    }
    // Found 0xA (public_key).
    publicKeys.push(
      getBinaryString(bytesView, startOffset, startOffset + keyprooflength),
    );
    startOffset = keyproofend;
  }
  if (!publicKeys.length) {
    console.warn('proto: Did not find any public key');
    return null;
  }
  if (!crxIdBin) {
    console.warn('proto: Did not find crx_id');
    return null;
  }
  const crxIdHex = Buffer.from(
    getBinaryString(crxIdBin, 0, 16),
    'binary',
  ).toString('hex');

  for (let i = 0; i < publicKeys.length; ++i) {
    const publicKeyBin = Buffer.from(publicKeys[i], 'binary');
    const sha256sum = createHash('sha256').update(publicKeyBin).digest('hex');

    if (sha256sum.slice(0, 32) === crxIdHex) {
      return publicKeyBin;
    }
  }
  console.warn('proto: None of the public keys matched with crx_id');

  return null;
}

export const parseCrx = (buf: Buffer) => {
  // 50 4b 03 04
  // This is actually a zip file
  if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4) {
    return { zip: buf };
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
  let publicKey;

  if (buf[4] === 2) {
    publicKeyLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
    signatureLength = calcLength(buf[12], buf[13], buf[14], buf[15]);
    // 16 = Magic number (4), CRX format version (4), lengths (2x4)
    zipStartOffset = 16 + publicKeyLength + signatureLength;

    publicKey = Buffer.from(
      getBinaryString(buf, 16, 16 + publicKeyLength),
      'binary',
    );
  } else if (buf[4] === 3) {
    // CRX3 - https://cs.chromium.org/chromium/src/components/crx_file/crx3.proto
    const crx3HeaderLength = calcLength(buf[8], buf[9], buf[10], buf[11]);
    // 12 = Magic number (4), CRX format version (4), header length (4)
    zipStartOffset = 12 + crx3HeaderLength;

    publicKey = getPublicKeyFromProtoBuf(buf, 12, zipStartOffset);
  }

  const crxId = createHash('sha256')
    .update(publicKey)
    .digest('hex')
    .split('')
    .map((x) => (parseInt(x, 16) + 0x0a).toString(26))
    .join('')
    .slice(0, 32);

  // 16 = Magic number (4), CRX format version (4), lengths (2x4)
  zipStartOffset = 16 + publicKeyLength + signatureLength;

  return { zip: buf.slice(zipStartOffset, buf.length), id: crxId, publicKey };
};
