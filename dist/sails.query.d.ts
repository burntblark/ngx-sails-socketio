import { Sails } from "./sails";
import { SailsModelInterface } from "./sails.model.interface";
import { RequestCriteria } from "./sails.request.criteria";
export declare class SailsQuery<T extends SailsModelInterface> {
    private modelClass;
    private model;
    private request;
    private criteria;
    private errorMsg;
    constructor(sails: Sails, modelClass: {
        new (): T;
    });
    find(): Promise<T[]>;
    findById(id: string): Promise<T>;
    save(model: T): Promise<T>;
    update(id: string, model: Partial<T>): Promise<T>;
    remove(id: string): Promise<T>;
    setLimit(limit: number): this;
    setSort(sort: string): this;
    setSkip(skip: number): this;
    setPopulation(...population: string[]): this;
    setRequestCriteria(criteria: RequestCriteria): this;
    private getRequestCriteria();
}
