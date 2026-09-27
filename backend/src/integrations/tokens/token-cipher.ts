import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  type CipherGCMTypes,
} from 'crypto';

const VERSION = 'v1';
const ALGORITHM: CipherGCMTypes = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

export function encryptToken(plaintext: string, keyBase64: string): string {
  const key = decodeKey(keyBase64);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join(':');
}

export function decryptToken(payload: string, keyBase64: string): string {
  const key = decodeKey(keyBase64);
  const [version, ivPart, tagPart, dataPart] = payload.split(':');
  if (version !== VERSION || !ivPart || !tagPart || !dataPart) {
    throw new Error('Unrecognized token payload');
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivPart, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataPart, 'base64url')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

function decodeKey(keyBase64: string): Buffer {
  const key = Buffer.from(keyBase64, 'base64');
  if (key.length !== KEY_LENGTH) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be 32 bytes encoded as base64');
  }
  return key;
}
