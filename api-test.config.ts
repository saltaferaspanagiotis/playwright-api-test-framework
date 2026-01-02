import { loadEnv } from './environment-config/env';
import { encrypt, decrypt } from './environment-config/encryption';

loadEnv();
console.log(`Running tests against the ${process.env.NODE_ENV} environment`);
if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is not set.');
}
if (!process.env.USER_NAME) {
    throw new Error('USER_NAME environment variable is not set.');
}
if (!process.env.PASSWORD) {
    throw new Error('PASSWORD environment variable is not set.');
}
const config = {
  api: {
    baseURL: process.env.BASE_URL,
    username: process.env.USER_NAME,
    password: decrypt(process.env.PASSWORD),
  },
};

export { config };