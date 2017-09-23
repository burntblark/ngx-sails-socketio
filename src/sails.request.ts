import { Sails } from "./sails";
import { SailsResponseCallback } from "./sails.response.callback";
import { RequestCriteria } from "./sails.request.criteria";
import { SailsResponse } from "./sails.response";

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
    private parameters: string[] = [];

    constructor(private sails: Sails) { }

    public get(url: string, callback: SailsResponseCallback): void {
        return this.sails.request(Method.GET, this.buildQuery(url), {}, (response) => callback(response));
    }

    public post(url: string, data: object, callback: SailsResponseCallback): void {
        return this.sails.request(Method.POST, this.buildQuery(url), data, (response) => callback(response));
    }

    public put(url: string, data: object, callback: SailsResponseCallback): void {
        return this.sails.request(Method.PUT, this.buildQuery(url), data, (response) => callback(response));
    }

    public delete(url: string, callback: SailsResponseCallback): void {
        return this.sails.request(Method.DELETE, this.buildQuery(url), {}, (response) => callback(response));
    }

    public on(eventName): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.sails.on(eventName.toLowerCase(), (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(res.getData());
                }
                reject(res);
            });
        });
    }

    protected buildQuery(url: string): string {
        let queryBuilder = new QueryBuilder(this.getParams());
        return url + queryBuilder.toString();
    }

    public addParam(name: string, value: boolean | number | string): this {
        if (value) {
            this.parameters.push(`${name}=${"" + value}`);
        }
        return this;
    }

    public getParams(): string {
        return this.parameters.join("&");
    }
}
