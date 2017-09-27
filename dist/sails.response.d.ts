import { SailsIOClient } from "./sails.io.client";
export declare class SailsResponse {
    private JWR;
    constructor(JWR: SailsIOClient.JWR.Response);
    getCode(): string;
    getData(): any;
    getMessage(): string;
    getBody(): SailsIOClient.JWR.Body;
    getHeaders(): SailsIOClient.Headers;
    getError(): string;
    getStatusCode(): number;
    pipe(): Error;
    toPOJO(): object;
    toString(): string;
}
