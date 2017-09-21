import { SailsModelInterface } from "./sails.model.interface";
import { Observable } from "rxjs";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";
import * as _ from "lodash";
import { Sails } from "./sails";
import { SailsModel } from "./sails.model";
import { Criteria } from "./sails.query.criteria";

export enum METHOD {
    POST,
    GET,
    DELETE,
    UPDATE
}

export class SailsQuery<T extends SailsModelInterface> {
    private _model: SailsModelInterface;
    private criteria: object = {};
    private orCriteria: object = {};
    private where: string = "";
    private limit: number = 30;
    private sort: string = "";
    private skip: number = 0;
    private population: string[] = [];

    private get model(): SailsModelInterface {
        return this._model;
    }

    constructor(private sails: Sails, type: typeof SailsModel) {
        this._model = new type();
        // this._model = new type(this.sails);
    }

    find(): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${this.model.getEndPoint()}`;
            let query = this.buildQuery();
            if (query) {
                url += query;
            }
            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            })
        });
    }

    findById(id: string, populate?: string[]): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url =  `/${this.model.getEndPoint().toLowerCase()}/${id}`;
            if (populate) {
                if (url.includes("?")) {
                    url += `&populate=[${populate.join(",")}]`;
                } else {
                    url += `?populate=[${populate.join(",")}]`;
                }
            }
            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    findAll(populate?: string[]): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url =  `/${this.model.getEndPoint().toLowerCase()}`;
            if (populate) {
                if (url.includes("?")) {
                    url += `&populate=[${populate.join(",")}]`;
                } else {
                    url += `?populate=[${populate.join(",")}]`;
                }
            }
            if (url.includes("?")) {
                url += "&limit=1000";
            } else {
                url += "?limit=1000";
            }

            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    save(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}`;
            this.sails.post(url, model, (res: SailsResponse): void => {
                if (res.getCode() === "CREATED") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    update(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            delete model.createdAt;
            delete model.updatedAt;
            this.sails.put(url, model, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    remove(model: T): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            this.sails.delete(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    action(path: string, method: METHOD, data?: any | SailsQuery<T>): Promise<SailsResponse | T | T[]> {
        let url = `/${this.model.getEndPoint().toLowerCase()}/${path}`;
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            if (method === METHOD.POST) {
                this.sails.post(url, data || {}, (res: SailsResponse): void => {
                    if (res.getCode() === "OK") {
                        resolve(this.marshalData(res.getData()));
                    }
                    reject(res);
                });
            } else {
                if (data instanceof SailsQuery) {
                    url += data.buildQuery();
                }
                this.sails.get(url, (res: SailsResponse): void => {
                    if (res.getCode() === "OK") {
                        resolve(this.marshalData(res.getData()));
                    }
                    reject(res);
                });
            }
        });
    }

    on(): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let eventName = this.model.getEndPoint().toLowerCase();
            this.sails.on(eventName, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    private marshalData(data: any): T | T[] {
        const callFn = (model: T): T => {
            let clone = _.clone(this.model);
            // delete clone.sails;
            return Object.assign(clone, model);
        };

        return _.isArray(data) ? data.map(callFn) : _.isObject(data) ? callFn(data) : data;
    }

    private whereFunction(): string {
        if (_.isEmpty(this.criteria)) {
            return null;
        }
        if (!_.isEmpty(this.orCriteria)) {
            if (_.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return "where=" + JSON.stringify(this.orCriteria);
        }
        return "where=" + JSON.stringify(this.criteria);
    }

    public setLimit(limit: number): SailsQuery<T> {
        this.limit = limit;
        return this;
    }

    public limitFunction(): string {
        if (this.limit == null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    }

    public setSort(sort: string): SailsQuery<T> {
        this.sort = sort;
        return this;
    }

    public sortFunction(): string {
        if (this.sort == null || _.isEmpty(this.sort)) {
            return null;
        }
        return "sort=" + this.sort;
    }

    public setSkip(skip: number): SailsQuery<T> {
        this.skip = skip;
        return this;
    }

    public skipFunction(): string {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    }

    public buildQuery(): string {
        let queryBuilder = "";
        let wherePart = this.whereFunction();
        if (wherePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += wherePart;
        }

        let limitPart = this.limitFunction();
        if (limitPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += limitPart;
        }

        let skipPart = this.skipFunction();
        if (skipPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += skipPart;
        }

        let populatePart = this.populateFunction();
        if (populatePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += populatePart;
        }

        if (queryBuilder.charAt(0) !== "?") {
            queryBuilder = "?" + queryBuilder;
        }
        return queryBuilder.toString();
    }


    public or(): SailsQuery<T> {
        if (_.isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (_.isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        } else if (_.isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    }

    public populate(value: string): SailsQuery<T> {
        if (_.isArray(this.population)) {
            this.population.push(value);
        }
        return this;
    }

    private populateFunction() {
        if (this.population == null || _.isEmpty(this.population)) {
            return null;
        }
        return "populate=[" + _.join(this.population, ",") + "]";
    }

    public whereNotEqualTo(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "!": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    }

    public whereLike(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "like": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["like"])) {
            this.criteria[key]["like"] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    }

    public whereContains(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "contains": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["contains"])) {
            this.criteria[key]["contains"] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    }

    public whereStartsWith(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "startsWith": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["startsWith"])) {
            this.criteria[key]["startsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    }

    public whereEndsWith(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "endsWith": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["endsWith"])) {
            this.criteria[key]["endsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    }

    public whereNotIn(key: string, value: string): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "!": [value] };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = [value];
            return this;
        }
        if (_.isArray(this.criteria[key]["!"])) {
            this.criteria[key]["!"].push(value);
        } else {
            this.criteria[key]["!"] = [this.criteria[key]["!"], value];
        }
        return this;
    }

    public whereLessThan(key: string, value: string | number | boolean | Date): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "<": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["<"])) {
            this.criteria[key]["<"] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    }

    public whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { "<=": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]["<="])) {
            this.criteria[key]["<="] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    }

    public whereGreaterThan(key: string, value: string | number | boolean | Date): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { ">": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key][">"])) {
            this.criteria[key][">"] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    }

    public whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): SailsQuery<T> {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { ">=": value };
            return this;
        }
        if (_.isUndefined(this.criteria[key][">="])) {
            this.criteria[key][">="] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    }

}
