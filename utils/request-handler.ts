import { APIRequestContext, expect } from "@playwright/test";
import { ApiLogger } from "./logger";
import {test } from '@playwright/test';

export class RequestHandler {

    private request: APIRequestContext;
    private baseUrl: string | undefined;
    private apiPath: string = '';
    private queryApiParams: Record<string, string> = {};
    private pathApiParams: Record<string, string> = {};
    private requestHeaders: Record<string, string> = {};
    private requestBody: Object = {};     
    private logger: ApiLogger;
    private authToken: string;
    private clearAuthHeaderFlag: boolean = false;


    constructor(requestApi: APIRequestContext, apiBaseUrl: string, logger : ApiLogger, authToken: string = ''){
        if (apiBaseUrl){
            this.baseUrl = apiBaseUrl;
        }
        this.request = requestApi;
        this.logger = logger;
        this.authToken = authToken;
    }
    
    url(url: string){
        this.baseUrl = url;
        return this;
    }

    path(path: string){
        this.apiPath = path;
        return this;
    }

    pathParams(params: Record<string, string>){
        this.pathApiParams = params;
        return this;
    }

    queryParams(params: Record<string, string>){
        this.queryApiParams = params;
        return this;
    }

    headers(headers: Record<string, string>){
        this.requestHeaders = headers;
        return this;
    }

    body(body: Object){
        this.requestBody = body;
        return this;
    }

    getUrl(): string {
        try {
            let resolvedPath = this.apiPath;
            for (const [key, value] of Object.entries(this.pathApiParams)) {
                resolvedPath = resolvedPath.replace(new RegExp(`{${key}}`, 'g'), encodeURIComponent(String(value)));
            }
            const url = new URL(`${this.baseUrl}${resolvedPath}`);
            for (const [key, value] of Object.entries(this.queryApiParams)) {
                url.searchParams.append(key, String(value));
            }
            return url.toString(); 
        }
            catch (e) {
                throw new Error('Base URL is not defined. Please set the base URL using the in the constructor.');
            }
    }
    
    async getRequest(expectedStatusCode: number){
        let responseJSON: any
        await test.step(`GET Request to ${this.getUrl()}`, async () => {
            const url = this.getUrl();
            this.logger.logRequest('GET', url, this.getHeaders(), this.requestBody);
            const response = await this.request.get(url,{
                headers: this.getHeaders()
            })
            this.cleanUp();
            const actualStatus = response.status();
            responseJSON = await response.json();
            this.logger.logResponse(actualStatus, responseJSON, response.headers());
            this.statusCodeValidator(expectedStatusCode, actualStatus, this.getRequest);
        });

        return responseJSON; 
    }

    async postRequest(expectedStatusCode: number){
        let responseJSON: any
        await test.step(`POST Request to ${this.getUrl()}`, async () => {
            const url = this.getUrl();
            this.logger.logRequest('POST', url, this.getHeaders(), this.requestBody);
            const response = await this.request.post(url,{
                headers: this.getHeaders(),
                data: this.requestBody
            })
            this.cleanUp();
            const actualStatus = response.status();
            responseJSON = await response.json();
            this.logger.logResponse(actualStatus, responseJSON, response.headers());
            this.statusCodeValidator(expectedStatusCode, actualStatus, this.postRequest);
        });
        return responseJSON; 
    }

    async putRequest(expectedStatusCode: number){
        let responseJSON: any
        await test.step(`PUT Request to ${this.getUrl()}`, async () => {
            const url = this.getUrl();
            this.logger.logRequest('PUT', url, this.getHeaders(), this.requestBody);
            const response = await this.request.put(url,{
                headers: this.getHeaders(),
                data: this.requestBody
            })
            this.cleanUp();
            this.logger.logResponse(response.status(), await response.json(), response.headers());
            const actualStatus = response.status();
            responseJSON = await response.json();
            this.statusCodeValidator(expectedStatusCode, actualStatus, this.putRequest);
        });
        return responseJSON; 
    }

    async deleteRequest(expectedStatusCode: number){
        let responseBody: any
        await test.step(`DELETE Request to ${this.getUrl()}`, async () => {
            const url = this.getUrl();
            this.logger.logRequest('DELETE', url, this.getHeaders(), this.requestBody);
            const response = await this.request.delete(url,{
                headers: this.getHeaders()
            })
            this.cleanUp();
            const actualStatus = response.status();
            responseBody = await response.text();
            this.statusCodeValidator(expectedStatusCode, actualStatus, this.deleteRequest);
            this.logger.logResponse(actualStatus, responseBody, response.headers());
        })
        return responseBody;
    }

    private statusCodeValidator(expectedStatusCode: number, actualStatusCode: number, callingMethod: Function){
        if (expectedStatusCode !== actualStatusCode){
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}\n\nRecent API logs:\n${logs}`);
            Error.captureStackTrace(error, callingMethod);
            throw error;
        }
    }

    private getHeaders(){
        if (!this.clearAuthHeaderFlag){
            this.requestHeaders['Authorization'] = this.requestHeaders['Authorization'] || `Bearer ${this.authToken}`;
        }
        return this.requestHeaders;
    }

    clearAuthHeader(){
        this.clearAuthHeaderFlag = true;
        return this;
    }

    private cleanUp(){
        this.baseUrl = undefined;
        this.apiPath = '';
        this.queryApiParams = {};
        this.pathApiParams = {};
        this.requestHeaders = {};
        this.requestBody = {};  
    }
}