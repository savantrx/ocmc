/**
 * API Key Encryption
 *
 * Encrypts/decrypts Agent Zero API keys stored in the database.
 * Uses AES-256-GCM with a key derived from AIOS_ENCRYPTION_KEY
 * or MC_API_TOKEN environment variable.
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const keySource = process.env.AIOS_ENCRYPTION_KEY || process.env.MC_API_TOKEN;
  if (!keySource) {
    throw new Error('AIOS_ENCRYPTION_KEY or MC_API_TOKEN must be set for API key encryption');
  }
  // Derive a 32-byte key from the source using SHA-256
  return crypto.createHash('sha256').update(keySource).digest();
}

/**
 * Encrypt a plaintext API key for storage.
 * Returns a base64-encoded string containing IV + ciphertext + auth tag.
 */
export function encryptApiKey(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Pack: IV (12) + ciphertext (variable) + authTag (16)
  const packed = Buffer.concat([iv, encrypted, authTag]);
  return packed.toString('base64');
}

/**
 * Decrypt a stored API key.
 */
export function decryptApiKey(ciphertext: string): string {
  const key = getEncryptionKey();
  const packed = Buffer.from(ciphertext, 'base64');

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(packed.length - AUTH_TAG_LENGTH);
  const encrypted = packed.subarray(IV_LENGTH, packed.length - AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
