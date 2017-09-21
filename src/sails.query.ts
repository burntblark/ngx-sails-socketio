import { Sails } from "./sails";
import { Criteria } from "./sails.query.criteria";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { clone, isArray, isObject, isEmpty } from "lodash";

export class SailsQuery<T extends SailsModelInterface> {
    private _model: T;
    private criteria: Criteria;
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

    constructor(private sails: Sails, model: { new (sails: Sails): T }) {
        this.model = new model(this.sails);
    }

    find(): Promise<SailsResponse | T | T[]> {
        return new Promise<SailsResponse | T | T[]>((resolve, reject) => {
            let url = this.buildQuery(`/${this.model.getEndPoint().toLowerCase()}`);
            console.log(url);

            this.sails.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
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
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    private marshalData(data: any): T | T[] {
        const callFn = (model: T): T => {
            const cloned = clone(this.model);
            // delete cloned.sails;
            return Object.assign(cloned, model);
        };

        return isArray(data) ? data.map(callFn) : isObject(data) ? callFn(data) : data;
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

    private getSort(): string {
        if (this.sort == null || isEmpty(this.sort)) {
            return null;
        }
        return "sort=" + this.sort;
    }

    public setSkip(skip: number): SailsQuery<T > {
        this.skip = skip;
        return this;
    }

    private getSkip(): string {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    }

    public addPopulation(... value: string[]): SailsQuery<T > {
        if (isArray(this.population)) {
            this.population.push(... value);
        }
        return this;
    }

    private getPopulation() {
        if (this.population === null || isEmpty(this.population)) {
            return null;
        }
        return `populate=[${this.population.join(",")}]`;
    }

    /*
    private orCriteria: object = {};
    public or(): SailsQuery<T> {
        if (isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        } else if (isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    }
    */

    public setCriteria(criteria: Criteria) {
        this.criteria = criteria;
        return this;
    }

    private getCriteria(): Criteria {
        return this.criteria;
    }

    private buildQuery(url: string): string {
        let queryBuilder = this.criteria.build();

        let limitPart = this.getLimit();
        if (limitPart != null) {
            if (!isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += limitPart;
        }

        let skipPart = this.getSkip();
        if (skipPart != null) {
            if (!isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += skipPart;
        }

        let populatePart = this.getPopulation();
        if (populatePart != null) {
            if (!isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += populatePart;
        }

        if (queryBuilder.charAt(0) !== "?") {
            queryBuilder = "?" + queryBuilder;
        }

        return url + queryBuilder.toString();
    }
}
