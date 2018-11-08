import { Sails } from "./sails";
import { SailsEvent } from "./sails.event";
import { Observable } from "rxjs";

export class SailsSubscription {

    constructor(private sails: Sails) { }

    public on(eventName): Observable<SailsEvent> {
        return this.sails.on(eventName.toLowerCase());
    }

    public off(eventName): Observable<SailsEvent> {
        return this.sails.off(eventName.toLowerCase());
    }
}
