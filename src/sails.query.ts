import { Sails } from "./sails";
import { QueryCriteria } from "./sails.query.criteria";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { marshalData } from "./sails.marshall";

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

export enum Method {
    POST,
    GET,
    DELETE,
    PUT,
    PATCH,
}

export class SailsQuery<T extends SailsModelInterface> {
    private _model: T;
    private criteria: QueryCriteria;
    private limit: number = 30;
    private sort: string = "";
    private skip: number = 0;
    private population: string[] = [];

    private set model(model: T) {
        this._model = model;
    }

    private get model(): T {
        return this._model;
    }

    constructor(private sails: Sails, private modelClass: { new(): T }) {
        this.model = new modelClass();
        // console.log(this.model)
    }

    find(): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = this.buildQuery(`/${this.model.getEndPoint().toLowerCase()}`);

            this.sails.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

    findById(id: string): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = this.buildQuery(`/${this.model.getEndPoint().toLowerCase()}/${id}`);
            this.sails.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

    public setLimit(limit: number): SailsQuery<T> {
        this.limit = limit;
        return this;
    }

    private getLimit(): string {
        if (this.limit === null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    }

    public setSort(sort: string): SailsQuery<T> {
        this.sort = sort;
        return this;
    }

    protected getSort(): string {
        if (this.sort === null || this.sort.length === 0) {
            return null;
        }
        return "sort=" + this.sort;
    }

    public setSkip(skip: number): SailsQuery<T> {
        this.skip = skip;
        return this;
    }

    private getSkip(): string {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    }

    public addPopulation(...value: string[]): SailsQuery<T> {
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

    public setCriteria(criteria: QueryCriteria) {
        this.criteria = criteria;
        return this;
    }

    private getCriteria(): QueryCriteria {
        return this.criteria || new QueryCriteria();
    }

    /*
    private orCriteria: object = {};
    public or(): SailsQuery<T> {
        if (isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (Array.isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        } else if (isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    }
    */

    private buildQuery(url: string): string {
        let queryBuilder = (new QueryBuilder(this.getCriteria().build()))
            .append(this.getLimit())
            .append(this.getSkip())
            .append(this.getPopulation())
            .append(this.getSort());

        return url + queryBuilder.toString();
    }

    save(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}`;
            const data = Object.assign({}, model);

            if (model.id === null) {
                this.sails.post(url, data, (res: SailsResponse) => {
                    if (res.getCode() === "CREATED") {
                        resolve(marshalData<T>(this.modelClass, res.getData()));
                    }
                    reject(res);
                });
            } else {
                this.sails.put(url.concat(`/${model.id}`), data, (res: SailsResponse) => {
                    console.log(url, data, res.getCode());
                    if (res.getCode() === "CREATED") {
                        resolve(marshalData<T>(this.modelClass, res.getData()));
                    }
                    reject(res);
                });
            }
        });
    }

    update(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            delete model.createdAt;
            delete model.updatedAt;
            this.sails.put(url, Object.assign({}, this), (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

    remove(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            this.sails.delete(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

    action(path: string, method: Method, data?: any): Promise<SailsResponse | T | T[]> {
        let url = `/${this.model.getEndPoint().toLowerCase()}/${path}`;
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            switch (method) {
                case Method.GET:
                case Method.DELETE:
                case Method.POST:
                case Method.PUT: {
                    this.sails.post(url, data || {}, (res: SailsResponse) => {
                        if (res.getCode() === "OK") {
                            resolve(marshalData<T>(this.modelClass, res.getData()));
                        }
                        reject(res);
                    });
                    break;
                }

                default: { }
            }
        });
    }

    on(): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            const eventName = this.model.getEndPoint().toLowerCase();
            this.sails.on(eventName, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

}
