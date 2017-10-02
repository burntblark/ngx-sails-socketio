import { SailsIOClient } from "./sails.io.client";

export interface SailsRequestOptionsInterface {
    url?: string;
    method?: string;
    params?: Map<string, string>;
    headers?: Map<string, string>;
}

export class SailsRequestOptions {
    private readonly options: SailsRequestOptionsInterface;

    constructor({ url, method, params, headers }: SailsIOClient.RequestOptions) {
        this.options = { url, method, params: this.toMap(params), headers: this.toMap(headers) };
    }

    clone(options: SailsRequestOptionsInterface): this {
        // Strip out undefined values
        for (const name in options) {
            if (!this.options.hasOwnProperty(name) || !options[name]) {
                delete options[name];
            }
        }

        Object.assign(this.options, options);
        return this;
    }

    private toMap(obj: { [key: string]: any } = {}) {
        let map = new Map;
        Object.keys(obj).forEach(k => (map.set(k, obj[k])));
        return map;
    }

    private toObject(map: Map<string, string> = new Map) {
        let obj = {};
        map.forEach((v, k) => (obj[k] = v));
        return obj;
    }

    get method(): string {
        return this.options.method;
    }

    get url(): string {
        return this.options.url;
    }

    get params(): Map<string, string> {
        return this.options.params;
    }

    get headers(): Map<string, string> {
        return this.options.headers;
    }

    serialize(): SailsIOClient.RequestOptions {
        return {
            url: this.url,
            method: this.method,
            params: this.toObject(this.params),
            headers: this.toObject(this.headers)
        };
    }
}
