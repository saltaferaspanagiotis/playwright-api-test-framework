import { expect as baseExpect } from '@playwright/test';
import { ApiLogger } from './logger'; 
import { validateSchema } from './schema-validator';

let apiLogger: ApiLogger;

export function setCustomeExpectLogger(logger: ApiLogger){
    apiLogger = logger;
}


declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            shouldBeLessThanOrEqual(expected: T): R;
            shouldBeDefined(): R;
            shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>;
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any){
        let pass: boolean;
        let logs: string = '';
        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            if (this.isNot){
                logs = apiLogger.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not ' : '';
        const message = () =>  this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `API Logs:\n${logs}`;

        return {
        message,
        pass,
        name: 'shouldEqual',
        expected,
        actual: received,
        };
    },

    shouldBeLessThanOrEqual(received: any, expected: any){
        let pass: boolean;
        let logs: string = '';
        try {
            baseExpect(received).toBeLessThanOrEqual(expected);
            pass = true;
            if (this.isNot){
                logs = apiLogger.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not ' : '';
        const message = () =>  this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `API Logs:\n${logs}`;

        return {
        message,
        pass,
        name: 'shouldBeLessThanOrEqual',
        expected,
        actual: received,
        };
    },

    shouldBeDefined(received: any){
        let pass: boolean;
        let logs: string = '';
        try {
            baseExpect(received).toBeDefined();
            pass = true;
            if (this.isNot){
                logs = apiLogger.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not ' : '';
        const message = () =>  this.utils.matcherHint('shouldBeDefined', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `API Logs:\n${logs}`;

        return {
        message,
        pass,
        name: 'shouldBeDefined',
        actual: received,
        };
    },
        async shouldMatchSchema(response: any, dirName: string, fileName: string, createSchemaFlag?: boolean){
        let pass: boolean;
        let message: string = '';
        try {
            await validateSchema(dirName, fileName, response, createSchemaFlag);
            pass = true;
            message = 'Validation schema passed.';
        } catch (e: any) {
            pass = false;
            message = `${e.message} \n\n` + 
            `API Logs:\n${apiLogger.getRecentLogs()}`;
        }

        return {
        message: () => message,
        pass,
        name: 'shouldMatchSchema'
        };
    }
});