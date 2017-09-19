/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Tunde
 */
export class SailsResponse {

    private code: string;
    private data: any;
    private message: string;

    constructor(raw: any) {
        if (raw["code"]) {
            this.code = raw["code"];
        }
        if (raw["data"]) {
            this.data = raw["data"];
        }
        if (raw["message"]) {
            this.message = raw["message"];
        }
    }

    public getCode(): string {
        return this.code;
    }

    public getData(): any{
        return this.data;
    }

    public getMessage(): string {
        return this.message;
    }
}
