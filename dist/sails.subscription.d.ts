import { Sails } from "./sails";
import { SailsEvent } from "./sails.event";
import { Observable } from "rxjs/Observable";
export declare class SailsSubscription {
    private sails;
    constructor(sails: Sails);
    on(eventName: any): Observable<SailsEvent>;
    off(eventName: any): Observable<SailsEvent>;
}
