import crypto from 'crypto';

export function getKeyAltName(userId: string): string {
  return crypto
    .createHmac('sha256', process.env.KEY_DERIVATION_SECRET!)
    .update(userId)
    .digest('base64url');
}
