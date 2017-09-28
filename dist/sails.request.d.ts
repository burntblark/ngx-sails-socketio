import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
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
    post(url: string, data: object): Promise<SailsResponse>;
    put(url: string, data: object): Promise<SailsResponse>;
    delete(url: string): Promise<SailsResponse>;
    patch(url: string): Promise<SailsResponse>;
    private _request(method, url, data?);
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
