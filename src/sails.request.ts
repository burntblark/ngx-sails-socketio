import { Sails } from "./sails";
import { SailsResponseCallback } from "./sails.response.callback";
import { RequestCriteria } from "./sails.request.criteria";
import { SailsResponse } from "./sails.response";

export class QueryBuilder {
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
        if (this.query.charAt(0) !== "?") {
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
    private criteria: RequestCriteria;
    private limit: number = 30;
    private sort: string = "";
    private skip: number = 0;
    private population: string[] = [];

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

    public setRequestCriteria(criteria: RequestCriteria) {
        this.criteria = criteria;
        return this;
    }

    private getRequestCriteria(): RequestCriteria {
        return this.criteria || new RequestCriteria();
    }

    protected buildQuery(url: string): string {
        let queryBuilder = (new QueryBuilder(this.getRequestCriteria().build()))
            .append(this.getLimit())
            .append(this.getSkip())
            .append(this.getPopulation())
            .append(this.getSort());

        return url + queryBuilder.toString();
    }

    public setLimit(limit: number): SailsRequest {
        this.limit = limit;
        return this;
    }

    private getLimit(): string {
        if (this.limit === null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    }

    public setSort(sort: string): SailsRequest {
        this.sort = sort;
        return this;
    }

    private getSort(): string {
        if (this.sort === null || this.sort.length === 0) {
            return null;
        }
        return "sort=" + this.sort;
    }

    public setSkip(skip: number): SailsRequest {
        this.skip = skip;
        return this;
    }

    private getSkip(): string {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    }

    public addPopulation(...value: string[]): SailsRequest {
        if (Array.isArray(this.population)) {
            this.population.push(...value);
        }
        return this;
    }

    private getPopulation() {
        if (this.population === null || this.population.length === 0) {
            return null;
        }
        return `populate=[${this.population.join(",")}]`;
    }
}
