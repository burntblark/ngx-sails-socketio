import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";

export class SailsRequestOptions {
    constructor(private options: {
        url: string;
        method: string;
        params: any;
        headers: SailsIOClient.Headers
    } = {
            url: "",
            method: "",
            params: {},
            headers: {}
        }) { }

    clone(options: {
        url?: string;
        method?: string;
        params?: any;
        headers?: SailsIOClient.Headers
    }): this {
        Object.assign(this, { options });
        return this;
    }

    get method(): string {
        return this.options.method;
    }
    get url(): string {
        return this.options.url;
    }
    get params(): Object {
        return this.options.params;
    }
    get headers(): SailsIOClient.Headers {
        return this.options.headers;
    }

    getOptions() {
        return this.options;
    }
}

class QueryBuilder {
    constructor(private query: string = "") { }

    append(criteria: string) {
        if (typeof criteria === "string") {
            if (this.query.length) {
                this.query += "&";
            }
            this.query += criteria;
        }
        return this;
    }

    toString() {
        if (this.query && this.query.charAt(0) !== "?") {
            this.query = "?" + this.query;
        }
        return this.query;
    }
}

export const Method = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
};

export class SailsRequest {
    private headers: SailsIOClient.Headers = {};
    private parameters: string[] = [];

    constructor(private sails: Sails) { }

    public get(url: string) {
        return this._request(Method.GET, url);
    }

    public post(url: string, params: object) {
        return this._request(Method.POST, url, params);
    }

    public put(url: string, params: object) {
        return this._request(Method.PUT, url, params);
    }

    public delete(url: string) {
        return this._request(Method.DELETE, url);
    }

    public patch(url: string) {
        return this._request(Method.PATCH, url);
    }

    private _request(method: string, url: string, params?: Object): Promise<SailsResponse> {
        const request = new SailsRequestOptions({ method, url: this.buildQuery(url), params, headers: this.getHeaders() });
        return this.sails.request(request);
    }

    public on(eventName): Promise<SailsResponse> {
        return this.sails.on(eventName.toLowerCase());
    }

    public off(eventName): Promise<SailsResponse> {
        return this.sails.off(eventName.toLowerCase());
    }

    public addHeader(name: string, value: any): this {
        this.headers[name] = value;
        return this;
    }

    private getHeaders(): SailsIOClient.Headers {
        return this.headers;
    }

    public addParam(name: string, value: boolean | number | string | { toString(): string }): this {
        if (value.toString().length) {
            this.parameters.push(`${name}=${value}`);
        }
        return this;
    }

    private getParams(): string {
        return this.parameters.join("&");
    }

    private buildQuery(url: string): string {
        return url.toLowerCase() + new QueryBuilder(this.getParams());
    }
}
