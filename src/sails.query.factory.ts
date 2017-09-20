import { Injectable } from "@angular/core";
import { Sails } from "./sails";
import { SailsModel } from "./sails.model";
import { SailsQuery } from "./sails.query";

@Injectable()
export class SailsQueryFactory<T extends SailsModel> {
    constructor(private sails: Sails) { }

    public createQuery(type: typeof SailsModel): SailsQuery<T>{
        return new SailsQuery<T>(this.sails, type);
    }
}