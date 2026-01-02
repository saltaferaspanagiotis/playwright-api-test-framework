import { RequestHandler } from "../utils/request-handler";
import { expect } from '@playwright/test';
import { request } from "@playwright/test";
import { ApiLogger } from "../utils/logger";
import { config} from "../api-test.config";

export async function getAccessToken() : Promise<string>{
    const context = await request.newContext();
    const logger = new ApiLogger();
    const api = new RequestHandler(context, config.api.baseURL, logger);
    const response = await api
        .path('/api/authenticate')
        .body({username: config.api.username, password: config.api.password})
        .postRequest(200);
    expect(response.token).shouldBeDefined();
    return response.token;
}
