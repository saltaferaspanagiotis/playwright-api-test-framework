import * as dotenv from 'dotenv';
import { resolve } from 'path';

export const loadEnv = () => {
    if ( !process.env.NODE_ENV ) {
        process.env.NODE_ENV = 'local';
    }
    console.log(`Using environment variables from testdata.${process.env.NODE_ENV}.env file`);
    const env = process.env.NODE_ENV;
    const envFilePath = resolve(__dirname, `../environment-config/testdata.${env}.env`);
    dotenv.config({ path: envFilePath });
};