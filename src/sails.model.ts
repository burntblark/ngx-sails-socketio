import { SailsModelInterface } from "./sails.model.interface";

export class SailsModel implements SailsModelInterface {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
}