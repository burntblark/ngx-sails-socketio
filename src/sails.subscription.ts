import { Sails } from "./sails";
import { SailsResponse } from "./sails.response";
import { SailsIOClient } from "./sails.io.client";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsEvent } from "./sails.event";

export class SailsSubscription {

    constructor(private sails: Sails) { }

    public on(eventName, cb) {
        this.sails.on(eventName.toLowerCase(), cb);
    }

    public off(eventName): Promise<SailsEvent> {
        return this.sails.off(eventName.toLowerCase());
    }
}
