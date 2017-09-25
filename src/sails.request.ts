import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";

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

export class Method {
    static GET = "get";
    static POST = "post";
    static PUT = "put";
    static DELETE = "delete";
    static PATCH = "patch";
}

export class SailsRequest {
    private headers: SailsIOClient.JWR.Header = {};
    private parameters: string[] = [];

    constructor(private sails: Sails) { }

    public get(url: string): Promise<SailsResponse> {
        return this._request(Method.GET, url);
    }

    public post(url: string, data: object): Promise<SailsResponse> {
        return this._request(Method.POST, url, data);
    }

    public put(url: string, data: object): Promise<SailsResponse> {
        return this._request(Method.PUT, url, data);
    }

    public delete(url: string): Promise<SailsResponse> {
        return this._request(Method.DELETE, url);
    }

    public patch(url: string): Promise<SailsResponse> {
        return this._request(Method.PATCH, url);
    }

    private _request(method: Method, url: string, data?: Object) {
        return this.sails.request(Method.DELETE, this.buildQuery(url), data, this.getHeaders());
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

    private getHeaders(): SailsIOClient.JWR.Header {
        return this.headers;
    }

    public addParam(name: string, value: boolean | number | string | { toString(): string }): this {
        if (value) {
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
