import { SailsIOClient } from "./sails.io.client";

export class SailsResponse {
    constructor(private JWR: SailsIOClient.JWR.Response) { }

    public isOk(): boolean {
        return this.getStatusCode() >= 200 && this.getStatusCode() < 300;
    }

    public isCreated(): boolean {
        return this.getStatusCode() === 201;
    }

    public isError(): boolean {
        return this.isClientError() || this.isServerError();
    }

    public isClientError(): boolean {
        return this.getStatusCode() >= 400 && !this.isServerError();
    }

    public isServerError(): boolean {
        return this.getStatusCode() >= 500;
    }

    public getCode(): string {
        return this.getBody().code;
    }

    public getData(): any {
        return this.getBody().data;
    }

    public getMessage(): string {
        return this.getBody().message;
    }

    public getBody(): SailsIOClient.JWR.Body {
        return this.JWR.body;
    }

    public getHeaders(): SailsIOClient.Headers {
        return this.JWR.headers;
    }

    public getError(): string {
        return this.JWR.error;
    }

    public getStatusCode(): number {
        return this.JWR.statusCode;
    }

    public pipe() {
        return this.JWR.pipe();
    }

    public toPOJO() {
        return this.JWR.toPOJO();
    }

    public toString() {
        return this.JWR.toString();
    }
}
