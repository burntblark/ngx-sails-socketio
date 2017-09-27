import { Sails } from "./sails";
import { SailsModel } from "./sails.model";
import { SailsRequest } from "./sails.request";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { RequestCriteria } from "./sails.request.criteria";

export class SailsQuery<T extends SailsModelInterface> extends SailsRequest {
    private _model: T;
    private criteria: RequestCriteria;
    private errorMsg = `[SailsSocketIO]: the data is not an instance of ${this.modelClass.name}.
        You could SailsModel.serialize<${this.modelClass.name}>(${this.modelClass.name}, data) before doing a SailsQuery action.`;

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
        this.addParam("where", this.getRequestCriteria());
        let url = `/${this.model.getEndPoint()}`;
        return this.get(url).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return SailsModel.serialize<T>(this.modelClass, res.getData()) as T[];
            }
            throw res;
        });
    }

    findById(id: string): Promise<T> {
        this.addParam("where", this.getRequestCriteria());
        let url = `/${this.model.getEndPoint()}/${id}`;
        return this.get(url).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return SailsModel.serialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    save(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        let url = `/${model.getEndPoint()}`;
        const data = Object.assign({}, model);
        if (model.id === null) {
            return this.post(url, data).then((res: SailsResponse) => {
                if (res.getCode() === "CREATED") {
                    return SailsModel.serialize<T>(this.modelClass, res.getData()) as T;
                }
                throw res;
            });
        } else {
            return this.put(url.concat(`/${model.id}`), data).then((res: SailsResponse) => {
                if (res.getCode() === "CREATED") {
                    return SailsModel.serialize<T>(this.modelClass, res.getData()) as T;
                }
                throw res;
            });
        }
    }

    update(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        let url = `/${model.getEndPoint()}/${model.id}`;
        delete model.createdAt;
        delete model.updatedAt;
        const data = Object.assign({}, model);
        return this.put(url, data).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return SailsModel.serialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    remove(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        let url = `/${model.getEndPoint()}/${model.id}`;
        return this.delete(url).then((res: SailsResponse) => {
            if (res.getCode() === "OK") {
                return SailsModel.serialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    public setLimit(limit: number): this {
        this.addParam("limit", limit);
        return this;
    }

    public setSort(sort: string): this {
        this.addParam("sort", sort);
        return this;
    }

    public setSkip(skip: number): this {
        this.addParam("skip", skip);
        return this;
    }

    public setPopulation(...population: string[]): this {
        this.addParam("populate", `[${population.join(",")}]`);
        return this;
    }

    public setRequestCriteria(criteria: RequestCriteria): this {
        this.criteria = criteria;
        return this;
    }

    private getRequestCriteria(): RequestCriteria {
        return this.criteria || new RequestCriteria();
    }
}
