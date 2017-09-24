import { Sails } from "./sails";
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

    public get(url: string): Promise<SailsResponse | void> {
        return this.sails.request(Method.GET, this.buildQuery(url));
    }

    public post(url: string, data: object): Promise<SailsResponse | void> {
        return this.sails.request(Method.POST, this.buildQuery(url), data);
    }

    public put(url: string, data: object): Promise<SailsResponse | void> {
        return this.sails.request(Method.PUT, this.buildQuery(url), data);
    }

    public delete(url: string): Promise<SailsResponse | void> {
        return this.sails.request(Method.DELETE, this.buildQuery(url));
    }

    public on(eventName): Promise<any> {
        return this.sails.on(eventName.toLowerCase()).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return res.getData();
            }
            return res;
        });
    }

    public off(eventName): Promise<any> {
        return this.sails.off(eventName.toLowerCase()).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return res.getData();
            }
            return res;
        });
    }

    public addParam(name: string, value: boolean | number | string | { toString(): string }): this {
        if (value) {
            this.parameters.push(`${name}=${value.toString()}`);
        }
        return this;
    }

    private getParams(): string {
        return this.parameters.join("&");
    }

    private buildQuery(url: string): string {
        let queryBuilder = new QueryBuilder(this.getParams());
        return url + queryBuilder.toString();
    }
}
