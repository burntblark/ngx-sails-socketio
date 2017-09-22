import { Sails } from "./sails";
import { SailsQuery } from "./sails.query";
import { SailsModelInterface } from "./sails.model.interface";
import { SailsResponse } from "./sails.response";
import { isObject, clone } from "lodash";
import { Property } from "./sails.marshall";

export class SailsModel implements SailsModelInterface {
    @Property()
    id: string = null;
    @Property({ type : Date })
    createdAt: Date = null;
    @Property({ type : Date })
    updatedAt: Date = null;

    getEndPoint(): string {
        return this.getEndPoint();
    }
}