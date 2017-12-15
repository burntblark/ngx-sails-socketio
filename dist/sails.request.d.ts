import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";
export declare const Method: {
    GET: string;
    POST: string;
    PUT: string;
    DELETE: string;
    PATCH: string;
};
export declare class SailsRequest {
    private sails;
    private parameters;
    constructor(sails: Sails);
    get(url: string, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    post(url: string, params: object, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    put(url: string, params: object, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    delete(url: string, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    patch(url: string, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    private _request(method, url, params?, headers?);
    addParam(name: string, value: boolean | number | string | {
        toString(): string;
    }): this;
    private getParams();
    private buildQuery(url);
}
