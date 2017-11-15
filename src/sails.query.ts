import { Sails } from "./sails";
import { SailsModel } from "./sails.model";
import { SailsRequest } from "./sails.request";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { RequestCriteria } from "./sails.request.criteria";

export class SailsQuery<T extends SailsModelInterface> {
    private model: T;
    private request: SailsRequest;
    private criteria: RequestCriteria;
    private errorMsg = `[SailsSocketIO]: the data is not an instance of ${this.modelClass.name}.
        You could SailsModel.unserialize(${this.modelClass.name}, data) as ${this.modelClass.name}[] (Array of Models), Or
        SailsModel.unserialize(${this.modelClass.name}, data) as ${this.modelClass.name} (Single Models)
        after fetching the data with SailsRequest.`;

    constructor(sails: Sails, private modelClass: { new(): T }) {
        this.request = new SailsRequest(sails);
        this.model = new modelClass();
    }

    public find(): Promise<T[]> {
        this.request.addParam("where", this.getRequestCriteria());
        return this.request.get(`/${this.model.getEndPoint()}`).then(res => {
            if (res.isOk()) {
                return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T[];
            }
            throw res;
        });
    }

    public findById(id: string): Promise<T> {
        this.request.addParam("where", this.getRequestCriteria());
        return this.request.get(`/${this.model.getEndPoint()}/${id}`).then(res => {
            if (res.isOk()) {
                return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    public save(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        const data = SailsModel.serialize(model);
        const url = `/${model.getEndPoint()}`;
        if (model.id === null) {
            return this.request.post(url, data).then(res => {
                if (res.isOk()) {
                    return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T;
                }
                throw res;
            });
        } else {
            return this.request.put(url.concat("/", model.id), data).then(res => {
                if (res.isOk()) {
                    return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T;
                }
                throw res;
            });
        }
    }

    public update(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        delete model.createdAt;
        delete model.updatedAt;
        const data = SailsModel.serialize(model);
        return this.request.put(`/${model.getEndPoint()}/${model.id}`, data).then(res => {
            if (res.isOk()) {
                return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    public remove(model: T): Promise<T> {
        if (!(model instanceof this.modelClass)) {
            throw new TypeError(this.errorMsg);
        }

        return this.request.delete(`/${model.getEndPoint()}/${model.id}`).then(res => {
            if (res.isOk()) {
                return SailsModel.unserialize<T>(this.modelClass, res.getData()) as T;
            }
            throw res;
        });
    }

    public setLimit(limit: number): this {
        this.request.addParam("limit", limit);
        return this;
    }

    public setSort(sort: string): this {
        this.request.addParam("sort", sort);
        return this;
    }

    public setSkip(skip: number): this {
        this.request.addParam("skip", skip);
        return this;
    }

    public setPopulation(...population: string[]): this {
        this.request.addParam("populate", `[${population.join(",")}]`);
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
