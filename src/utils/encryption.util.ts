import crypto from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
const IV_LENGTH = 16;

const encryptData = (data: string | object): string => {
  const dataString = JSON.stringify(data);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let encryptedData = cipher.update(dataString, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return `${iv.toString('hex')}:${encryptedData}`;
}

const decryptData = (encryptedData: string): string | object => {
  const [ivString, dataString] = encryptedData.split(':');
  const iv = Buffer.from(ivString, 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let decryptedData = decipher.update(dataString, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return JSON.parse(decryptedData);
}

export { encryptData, decryptData };

