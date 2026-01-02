import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

export function encrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error('ENCRYPTION_KEY environment variable is not set.');
    }
    const key = scryptSync(encryptionKey, 'salt', 32);
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-cbc';
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        throw new Error('ENCRYPTION_KEY environment variable is not set.');
    }
    const key = scryptSync(encryptionKey, 'salt', 32);
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex');
    const decipher = createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedTextBuffer), decipher.final()]);
    return decrypted.toString('utf8');
}