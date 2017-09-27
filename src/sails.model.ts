import { Property, serialize, unserialize } from "./sails.serialize";
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

    static unserialize<U extends SailsModelInterface>(model: U): Object {
        return unserialize<U>(model);
    }

    static serialize<U extends SailsModelInterface>(modelClazz, data: Object | Object[]): U | U[] {
        const callFn = (model) => serialize<U>(modelClazz, model) as U;
        if (Array.isArray(data)) {
            return data.map(callFn);
        } else if (isObject(data)) {
            return callFn(data);
        }
        throw new Error("SailsModel.serialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
    }
}