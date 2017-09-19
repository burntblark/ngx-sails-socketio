import { SailsModelInterface } from "./sails.model.interface";
import { Endpoint } from "./sails.decorator.endpoint";
import { Sails } from "./sails";

// export class SailsModel implements SailsModelInterface<SailsModel> {
export class SailsModel {

    id: string | number;
    createdAt: Date;
    updatedAt: Date;

    constructor (
        private sails: Sails
    ) {

    }

    getEndPoint(): string {
        return "endpoint";
    }
}