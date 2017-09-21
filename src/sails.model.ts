import { Sails } from "./sails";
import { SailsQuery } from "./sails.query";
import { SailsModelInterface } from "./sails.model.interface";
import { SailsResponse } from "./sails.response";
import { isObject, clone } from "lodash";

export enum Method {
    POST,
    GET,
    DELETE,
    PUT,
    PATCH,
}

export class SailsModel implements SailsModelInterface {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;

    constructor(private sails: Sails) {}

    getEndPoint(): string {
        return this.getEndPoint();
    }

    private marshalData(data: any): this {
        const callFn = (model: this): this => {
            const cloned = clone(this);
            // delete cloned.sails;
            return Object.assign(cloned, model);
        };

        return isObject(data) ? callFn(data) : data;
    }

    save(): Promise<SailsResponse | this> {
        return new Promise<SailsResponse | this>((resolve, reject) => {
            let url = `/${this.getEndPoint().toLowerCase()}`;
            const data = {};
            // const data = Object.assign({}, this);
            // delete data.sails;
            // console.log(this);

            if (this.id === null) {
                this.sails.post(url, data, (res: SailsResponse) => {
                    if (res.getCode() === "CREATED") {
                        resolve(this.marshalData(res.getData()));
                    }
                    reject(res);
                });
            } else {
                this.sails.put(url.concat(`/${this.id}`), data, (res: SailsResponse) => {
                    console.log(url, data, res.getCode());
                    if (res.getCode() === "CREATED") {
                        resolve(this.marshalData(res.getData()));
                    }
                    reject(res);
                });
            }
        });
    }

    update(): Promise<SailsResponse | this> {
        return new Promise<SailsResponse | this>((resolve, reject) => {
            let url = `/${this.getEndPoint().toLowerCase()}/${this.id}`;
            delete this.createdAt;
            delete this.updatedAt;
            this.sails.put(url, Object.assign({}, this), (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    remove(): Promise<SailsResponse | this> {
        return new Promise<SailsResponse | this>((resolve, reject) => {
            let url = `/${this.getEndPoint().toLowerCase()}/${this.id}`;
            this.sails.delete(url, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }

    action(path: string, method: Method, data?: any): Promise<SailsResponse | this> {
        let url = `/${this.getEndPoint().toLowerCase()}/${path}`;
        return new Promise<SailsResponse | this>((resolve, reject) => {
            switch (method) {
                case Method.GET:
                case Method.DELETE:
                case Method.POST:
                case Method.PUT: {
                    this.sails.post(url, data || {}, (res: SailsResponse) => {
                        if (res.getCode() === "OK") {
                            resolve(this.marshalData(res.getData()));
                        }
                        reject(res);
                    });
                    break;
                }

                default: { }
            }
        });
    }

    on(): Promise<SailsResponse | this> {
        return new Promise<SailsResponse | this>((resolve, reject) => {
            const eventName = this.getEndPoint().toLowerCase();
            this.sails.on(eventName, (res: SailsResponse) => {
                if (res.getCode() === "OK") {
                    resolve(this.marshalData(res.getData()));
                }
                reject(res);
            });
        });
    }
}