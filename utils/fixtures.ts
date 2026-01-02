import { test as base } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { ApiLogger } from './logger';
import { setCustomeExpectLogger } from './assertions';
import { config } from '../api-test.config';
import { getAccessToken } from '../helpers/getAccessToken';

export type TestOptions = {
  api: RequestHandler;
  config: typeof config;
};

export type WorkerFixture = {
  authToken: string;
};

export const test = base.extend<TestOptions, WorkerFixture>({
  authToken: [async ({}, use) => {
    const token = await getAccessToken();
    await use(token);
  }, {scope : 'worker'}],
  api: async ({request, authToken}, use) => {
    const logger = new ApiLogger();
    setCustomeExpectLogger(logger);
    const requestHandler = new RequestHandler(request, config.api.baseURL, logger, authToken);
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  }
});

    