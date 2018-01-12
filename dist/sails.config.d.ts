import { SailsOptions } from "./sails.options";
export declare class SailsConfig implements SailsOptions {
    url: string;
    query: string;
    reconnection: boolean;
    autoConnect: boolean;
    transports: string[];
    useCORSRouteToGetCookie: boolean;
    headers: {};
    timeout: number;
    path: string;
    prefix: string;
    initialConnectionHeaders: any;
    multiplex: any;
    reconnectionAttempts: any;
    reconnectionDelay: any;
    reconnectionDelayMax: any;
    rejectUnauthorized: any;
    randomizationFactor: any;
    environment: any;
    constructor(options: SailsOptions);
}
