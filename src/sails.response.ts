/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { SailsIOClient } from "./sails.io.client.d";
/**
 *
 * @author Tunde
 */

export class SailsResponse {
    constructor(private JWR: SailsIOClient.JWR) {}

    public getCode(): string {
        return this.getBody().code;
    }

    public getData(): any {
        return this.getBody().data;
    }

    public getMessage(): string {
        return this.getBody().message;
    }

    public getBody(): SailsIOClient.JWRBody {
        return this.JWR.body;
    }

    public getHeaders(): { [key: string]: string|boolean } {
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
