import { SailsResponse } from "./sails.response";

export interface CanIntercept {
    /**
     * @returns boolean True if was intercepted else False
     */
    (response: SailsResponse): boolean;
}
