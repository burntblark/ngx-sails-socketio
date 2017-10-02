import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";
export declare class SailsRequestOptions {
    private options;
    constructor(options?: {
        url: string;
        method: string;
        params: any;
        headers: SailsIOClient.Headers;
    });
    clone(options: {
        url?: string;
        method?: string;
        params?: any;
        headers?: SailsIOClient.Headers;
    }): this;
    readonly method: string;
    readonly url: string;
    readonly params: Object;
    readonly headers: SailsIOClient.Headers;
    getOptions(): {
        url: string;
        method: string;
        params: any;
        headers: SailsIOClient.Headers;
    };
}
export declare const Method: {
    GET: string;
    POST: string;
    PUT: string;
    DELETE: string;
    PATCH: string;
};
export declare class SailsRequest {
    private sails;
    private headers;
    private parameters;
    constructor(sails: Sails);
    get(url: string): Promise<SailsResponse>;
    post(url: string, params: object): Promise<SailsResponse>;
    put(url: string, params: object): Promise<SailsResponse>;
    delete(url: string): Promise<SailsResponse>;
    patch(url: string): Promise<SailsResponse>;
    private _request(method, url, params?);
    on(eventName: any): Promise<SailsResponse>;
    off(eventName: any): Promise<SailsResponse>;
    addHeader(name: string, value: any): this;
    private getHeaders();
    addParam(name: string, value: boolean | number | string | {
        toString(): string;
    }): this;
    private getParams();
    private buildQuery(url);
}
