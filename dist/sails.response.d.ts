import { SailsIOClient } from "./sails.io.client";
export declare class SailsResponse {
    private JWR;
    constructor(JWR: SailsIOClient.JWR.Response);
    isOk(): boolean;
    isCreated(): boolean;
    isUnauthorized(): boolean;
    isForbidden(): boolean;
    isNotFound(): boolean;
    isBadRequest(): boolean;
    isError(): boolean;
    isClientError(): boolean;
    isServerError(): boolean;
    getCode(): string;
    getData(): any;
    getMessage(): string;
    getBody(): any;
    getHeaders(): SailsIOClient.Headers;
    getError(): string;
    getStatusCode(): number;
    pipe(): Error;
    toPOJO(): object;
    toString(): string;
}
