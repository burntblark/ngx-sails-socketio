import { Sails } from "./sails";
import { SailsEvent } from "./sails.event";
export declare class SailsSubscription {
    private sails;
    constructor(sails: Sails);
    on(eventName: any, cb: any): void;
    off(eventName: any): Promise<SailsEvent>;
}
