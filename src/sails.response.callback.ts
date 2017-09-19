import { SailsResponse } from "./sails.response";

export interface SailsResponseCallback {
    (response: SailsResponse): void;
}
