import { Sails } from "./sails";
import { SailsRequest, Method } from "./sails.request";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { marshalData } from "./sails.marshall";
import { RequestCriteria } from "./sails.request.criteria";

export class SailsQuery<T extends SailsModelInterface> extends SailsRequest {
    private _model: T;
    private criteria: RequestCriteria;

    private set model(model: T) {
        this._model = model;
    }

    private get model(): T {
        return this._model;
    }

    constructor(sails: Sails, private modelClass: { new(): T }) {
        super(sails);
        this.model = new modelClass();
    }

    find(): Promise<T[]> {
        this.addParam("where", this.getRequestCriteria().build());
        return new Promise<T[]>((resolve, reject) => {
            let url = `/${this.model.getEndPoint().toLowerCase()}`;

            this.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()) as T[]);
                }
                reject(res);
            });
        });
    }

    findById(id: string): Promise<T> {
        this.addParam("where", this.getRequestCriteria().build());
        return new Promise<T>((resolve, reject) => {
            let url = `/${this.model.getEndPoint().toLowerCase()}/${id}`;
            this.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()) as T);
                }
                reject(res);
            });
        });
    }

    save(model: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}`;
            const data = Object.assign({}, model);

            if (model.id === null) {
                this.post(url, data, (res: SailsResponse) => {
                    if (res.getCode() === "CREATED") {
                        resolve(marshalData<T>(this.modelClass, res.getData()) as T);
                    }
                    reject(res);
                });
            } else {
                this.put(url.concat(`/${model.id}`), data, (res: SailsResponse) => {
                    console.log(url, data, res.getCode());
                    if (res.getCode() === "CREATED") {
                        resolve(marshalData<T>(this.modelClass, res.getData()) as T);
                    }
                    reject(res);
                });
            }
        });
    }

    update(model: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            delete model.createdAt;
            delete model.updatedAt;
            this.put(url, Object.assign({}, this), (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()) as T);
                }
                reject(res);
            });
        });
    }

    remove(model: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let url = `/${model.getEndPoint().toLowerCase()}/${model.id}`;
            this.delete(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()) as T);
                }
                reject(res);
            });
        });
    }

    public setLimit(limit: number): SailsRequest {
        this.addParam("limit", limit);
        return this;
    }

    public setSort(sort: string): SailsRequest {
        this.addParam("sort", sort);
        return this;
    }

    public setSkip(skip: number): SailsRequest {
        this.addParam("skip", skip);
        return this;
    }

    public setPopulation(...population: string[]): SailsRequest {
        this.addParam("populate", `[${population.join(",")}]`);
        return this;
    }

    public setRequestCriteria(criteria: RequestCriteria) {
        this.criteria = criteria;
        return this;
    }

    private getRequestCriteria(): RequestCriteria {
        return this.criteria || new RequestCriteria();
    }
}
