import { Sails } from "./sails";
import { SailsModelInterface } from "./sails.model.interface";
import { RequestCriteria } from "./sails.request.criteria";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
export declare class SailsQuery<T extends SailsModelInterface> {
    private modelClass;
    private model;
    private request;
    private criteria;
    private errorMsg;
    constructor(sails: Sails, modelClass: {
        new (): T;
    });
    find(): Observable<T[]>;
    findById(id: string): Observable<T>;
    save(model: T): Observable<T>;
    update(id: string, model: Partial<T>): Observable<T>;
    remove(id: string): Observable<T>;
    setLimit(limit: number): this;
    setSort(sort: string): this;
    setSkip(skip: number): this;
    setPopulation(...population: string[]): this;
    setRequestCriteria(criteria: RequestCriteria): this;
    private getRequestCriteria();
}
