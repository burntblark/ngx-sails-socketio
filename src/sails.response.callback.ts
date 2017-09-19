import { SailsResponse } from "./sails.response";

export interface SailsResponseCallback {
    done(res: SailsResponse): void;
}
