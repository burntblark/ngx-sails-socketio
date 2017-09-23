import { SailsResponse } from "ngx-sails-socketio";

export function AuthIntercept(response: SailsResponse): boolean {
    console.log(response);
    return true;
}
