import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_SECRET_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("Missing encryption key. Please set REACT_APP_SECRET_KEY in your .env file.");
}

export const encryptId = (id: string | number): string | null => {
  try {
    return encodeURIComponent(
      CryptoJS.AES.encrypt(id.toString(), ENCRYPTION_KEY).toString()
    );
  } catch (error) {
    console.error("Error encrypting ID:", error);
    return null;
  }
};

export const decryptId = (encryptedId: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error("Error decrypting ID:", error);
    return null;
  }
};
