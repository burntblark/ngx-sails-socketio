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

    static serialize<U extends SailsModelInterface>(model: U): Object {
        const data = Object.assign({}, model);
        for (const name in data) {
            const prop: U = data[name];
            if (prop && prop instanceof SailsModel && prop.id !== null) {
                data[name] = prop.id;
            }
        }
        return data;
    }

    static unserialize<U extends SailsModelInterface>(modelClazz, data: Object | Object[]): U | U[] {
        const callFn = (model) => unserialize<U>(modelClazz, model) as U;
        if (Array.isArray(data)) {
            return data.map(callFn);
        } else if (isObject(data)) {
            return callFn(data);
        }
        throw new Error("SailsModel.unserialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
    }
}