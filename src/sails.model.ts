import { Property, unserialize } from "./sails.serialize";
import { SailsModelInterface } from "./sails.model.interface";
import { Endpoint } from "./sails.decorator.endpoint";
import { isObject } from "./utils";

@Endpoint()
export abstract class SailsModel implements SailsModelInterface {
    @Property() id: string = null;
    @Property({ type: Date }) createdAt: Date = null;
    @Property({ type: Date }) updatedAt: Date = null;

    getEndPoint(): string {
        return this.getEndPoint();
    }

    static serialize<U extends SailsModelInterface>(model: U): U {
        const recr = (obj) => {
            for (const key in obj) {
                const prop: U = obj[key];
                // Ignore NULL values
                if (prop === null || typeof prop === "function") {
                    delete obj[key];
                }

                // Convert Property Models to their ID representations
                if (prop && prop instanceof SailsModel && prop.id !== null) {
                    obj[key] = prop.id;
                }

                if (prop && prop instanceof SailsModel) {
                    obj[key] = SailsModel.serialize(prop);
                }

                if (prop && prop instanceof Array) {
                    obj[key] = prop.map( ob => {
                        if (ob instanceof SailsModel) {
                            return SailsModel.serialize(ob);
                        }

                        return ob;
                    });
                }
            }
            return obj;
        };
        return recr(Object.assign({}, model));
    }

    static unserialize<U extends SailsModelInterface>(modelClazz, data: U | U[]): U | U[] {
        const callFn = (model) => unserialize<U>(modelClazz, model) as U;
        if (Array.isArray(data)) {
            return data.map(callFn);
        } else if (isObject(data)) {
            return callFn(data);
        }
        throw new Error("SailsModel.unserialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
    }
}