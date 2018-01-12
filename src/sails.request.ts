import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";
import { SailsRequestOptions } from "./sails.request.options";
import { Observable } from "rxjs/Observable";

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
    private parameters: string[] = [];

    constructor(private sails: Sails) { }

    public get(url: string, headers?: SailsIOClient.Headers) {
        return this._request(Method.GET, url, headers);
    }

    public post(url: string, params: object, headers?: SailsIOClient.Headers) {
        return this._request(Method.POST, url, params, headers);
    }

    public put(url: string, params: object, headers?: SailsIOClient.Headers) {
        return this._request(Method.PUT, url, params, headers);
    }

    public delete(url: string, headers?: SailsIOClient.Headers) {
        return this._request(Method.DELETE, url, headers);
    }

    public patch(url: string, headers?: SailsIOClient.Headers) {
        return this._request(Method.PATCH, url, headers);
    }

    private _request(method: string, url: string, params?: Object, headers?: SailsIOClient.Headers): Observable<SailsResponse> {
        const request = new SailsRequestOptions({ method, url: this.buildQuery(url), params, headers });
        return this.sails.request(request);
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
