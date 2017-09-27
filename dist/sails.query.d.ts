import { Sails } from "./sails";
import { SailsRequest } from "./sails.request";
import { SailsModelInterface } from "./sails.model.interface";
import { RequestCriteria } from "./sails.request.criteria";
export declare class SailsQuery<T extends SailsModelInterface> extends SailsRequest {
    private modelClass;
    private _model;
    private criteria;
    private errorMsg;
    private model;
    constructor(sails: Sails, modelClass: {
        new (): T;
    });
    find(): Promise<T[]>;
    findById(id: string): Promise<T>;
    save(model: T): Promise<T>;
    update(model: T): Promise<T>;
    remove(model: T): Promise<T>;
    setLimit(limit: number): this;
    setSort(sort: string): this;
    setSkip(skip: number): this;
    setPopulation(...population: string[]): this;
    setRequestCriteria(criteria: RequestCriteria): this;
    private getRequestCriteria();
}
