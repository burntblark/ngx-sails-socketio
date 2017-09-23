import { Sails } from "./sails";
import { SailsRequest, Method } from "./sails.request";
import { SailsResponse } from "./sails.response";
import { SailsModelInterface } from "./sails.model.interface";
import { marshalData } from "./sails.marshall";

export class SailsQuery<T extends SailsModelInterface> extends SailsRequest {
    private _model: T;

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

    find(): Promise<T | T[]> {
        return new Promise<T | T[]>((resolve, reject) => {
            let url = this.buildQuery(`/${this.model.getEndPoint().toLowerCase()}`);

            this.get(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(marshalData<T>(this.modelClass, res.getData()));
                }
                reject(res);
            });
        });
    }

    findById(id: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let url = this.buildQuery(`/${this.model.getEndPoint().toLowerCase()}/${id}`);
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

    /**
     * @deprecated Use SailsRequest
     */
    action(path: string, method: Method, data?: any): Promise<any> {
        let url = `/${this.model.getEndPoint().toLowerCase()}/${path}`;
        return new Promise<any>((resolve, reject) => {
            switch (method) {
                case Method.GET:
                case Method.DELETE:
                case Method.POST:
                case Method.PUT: {
                    this.post(url, data || {}, (res: SailsResponse) => {
                        if (res.getCode() === "OK") {
                            resolve(res.getData());
                        }
                        reject(res);
                    });
                    break;
                }

                default: { }
            }
        });
    }
}
