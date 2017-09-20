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

export class SailsQuery<T extends SailsModel> {
    private _model: SailsModel;

    private criteria: object = {};

    private orCriteria: object = {};

    private where: string = "";

    private limit: number = 30;

    private sort: string = "";

    private skip: number = 0;

    private population: Array<string> = [];

    constructor(private sails: Sails, type: typeof SailsModel) {
        this._model = new type(this.sails);
    }

    private get model(): SailsModel {
        return this._model;
    }

    find(): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(this.model.getEndPoint());
            let query = this.buildQuery();
            if (query) {
                url += query;
            }
            let that = this;
            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            })
        });
    }

    findById(id: string, populate?: Array<string>): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(this.model.getEndPoint());
            url += "/".concat(id);
            if (populate) {
                if (url.includes("?")) {
                    url += "&populate=[" + _.join(populate, ",") + "]";
                } else {
                    url += "?populate=[" + _.join(populate, ",") + "]";
                }
            }
            let that = this;
            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    findAll(populate?: Array<string>): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(this.model.getEndPoint());
            if (populate) {
                if (url.includes("?")) {
                    url += "&populate=[" + _.join(populate, ",") + "]&limit=1000";
                } else {
                    url += "?populate=[" + _.join(populate, ",") + "]&limit=1000";
                }
            }
            if (url.includes("?")) {
                url += "&limit=1000";
            } else {
                url += "?limit=1000";
            }

            this.sails.get(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = this.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    save(model: SailsModel): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(model.getEndPoint());
            let that = this;
            this.sails.post(url, model, (res: SailsResponse): void => {
                if (res.getCode() === "CREATED") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    update(model: SailsModel): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(model.getEndPoint());
            url += "/".concat("" + model.id); // Make sure .id is a string
            // delete model.socketIOConfig; // Why???
            delete model.createdAt;
            delete model.updatedAt;
            let that = this;
            this.sails.put(url, model, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    remove(model: SailsModel): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let url = "/";
            url += _.toLower(model.getEndPoint());
            url += "/".concat("" + model.id); // Make sure .id is a string
            let that = this;
            this.sails.delete(url, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    action(path: string, method: METHOD, data?: any | SailsQuery<T>): Promise<SailsResponse> {
        let url = "/";
        url += _.toLower(this.model.getEndPoint());
        url += "/".concat(path);
        let that = this;
        return new Promise<SailsResponse>((resolve, reject) => {
            if (method === METHOD.POST) {
                this.sails.post(url, data || {}, (res: SailsResponse): void => {
                    if (res.getCode() === "OK") {
                        let results = that.castResponseToModel(res.getData());
                        resolve(results);
                    }
                    reject(res);
                });
            } else {
                if (data instanceof SailsQuery) {
                    url += data.buildQuery();
                }
                this.sails.get(url, (res: SailsResponse): void => {
                    if (res.getCode() === "OK") {
                        let results = that.castResponseToModel(res.getData());
                        resolve(results);
                    }
                    reject(res);
                });
            }
        });
    }

    on(): Promise<SailsResponse> {
        return new Promise<SailsResponse>((resolve, reject) => {
            let eventName = _.toLower(this.model.getEndPoint());
            let that = this;
            this.sails.on(eventName, (res: SailsResponse): void => {
                if (res.getCode() === "OK") {
                    let results = that.castResponseToModel(res.getData());
                    resolve(results);
                }
                reject(res);
            });
        });
    }

    private castResponseToModel(response: any): any {
        let singleR = this;
        let results = null;
        if (_.isArray(response)) {
            results = _.map(response, function (_item, index) {
                let item = _.clone(singleR);
                delete item.socketIOConfig;
                Object.assign(item, _item);
                return item;
            });
        } else if (_.isObject(response)) {
            let item = _.clone(singleR);
            delete item.socketIOConfig;
            Object.assign(item, response);
            results = item;
        }
        return results;
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