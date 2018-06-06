import { SailsIOClient } from "./sails.io.client";
export interface SailsRequestOptionsInterface {
    url?: string;
    method?: string;
    params?: Map<string, string>;
    headers?: Map<string, string>;
}
export declare class SailsRequestOptions {
    private readonly options;
    constructor({url, method, params, headers}: SailsIOClient.RequestOptions);
    clone(options: SailsRequestOptionsInterface): this;
    private toMap(obj?);
    private toObject(map?);
    readonly method: string | undefined;
    readonly url: string | undefined;
    readonly params: Map<string, string> | undefined;
    readonly headers: Map<string, string> | undefined;
    serialize(): SailsIOClient.RequestOptions;
}
