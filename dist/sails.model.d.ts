import { SailsModelInterface } from "./sails.model.interface";
export declare abstract class SailsModel implements SailsModelInterface {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    getEndPoint(): string;
    static serialize<U extends SailsModelInterface>(model: U): Object;
    static unserialize<U extends SailsModelInterface>(modelClazz: any, data: Object | Object[]): U | U[];
}
