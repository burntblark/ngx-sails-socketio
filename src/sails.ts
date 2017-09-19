import { Injectable } from "@angular/core";
import { connect } from "socket.io-client";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";

@Injectable()
export class Sails {
    private _socketInstance: SocketIOClient.Socket;
    private listeners: { [eventName: string]: ((JSONData: any) => void)[] } = {
        connect: [],
        connect_error: [],
        connect_timeout: [],
        connecting: [],
        reconnect: [],
        disconnect: []
    };
    requestOptions;
    requestToken = "";

    private get socket(): SocketIOClient.Socket {
        return this._socketInstance;
    }

    private set socket(_socketInstance: SocketIOClient.Socket) {
        this._socketInstance = _socketInstance;
    }

    constructor(private url: string, private sailsOptions: SocketIOClient.ConnectOpts) {
        const handleListeners = eventName => data => this.listeners[eventName].forEach(callback => callback(data));

        this.socket = connect(url, sailsOptions);
        this.socket.on("connect", (data) => {
            console.log("==== CONNECTED ====")
            console.log(data);
        });

        this.socket.on("connect", handleListeners("connect"));
        this.socket.on("connect_error", handleListeners("connect_error"));
        this.socket.on("connect_timeout", handleListeners("connect_timeout"));
        this.socket.on("connecting", handleListeners("connecting"));
        this.socket.on("reconnect", handleListeners("reconnect"));
        this.socket.on("disconnect", handleListeners("disconnect"));
    }

    private connected(): boolean {
        return this.socket.connected;
    }

    public connect(): Sails {
        if (!this.connected()) {
            this.socket.connect();
        }

        return this;
    }

    public disconnect(): Sails {
        if (this.connected()) {
            this.socket.disconnect();
        }

        return this;
    }

    public addEventListener(eventName, callback: (data: string) => void) {
        if (!this.listeners[eventName]) {
            return new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        this.listeners[eventName].push(callback);
    }

    /**
     * @todo
     * @param eventName
     */
    public removeEventListener(eventName) {

    }

    public get(url: string, callback: SailsResponseCallback): void {
        this.request("get", url, {}, (response) => callback(response));
    }

    public post(url: string, data: object, callback: SailsResponseCallback): void {
        this.request("post", url, data, (response) => callback(response));
    }

    public put(url: string, data: object, callback: SailsResponseCallback): void {
        this.request("put", url, data, (response) => callback(response));
    }

    public delete(url: string, callback: SailsResponseCallback): void {
        this.request("delete", url, {}, (response) => callback(response));
    }

    public request(method: string, url: string, data: object, callback: (response: SailsResponse) => void) {
        if (!this.connected()) {
            this.connect();
        }
        const headers = {
            Authorization: "Bearer " + this.requestToken
        };

        const payload = {
            method,
            url,
            headers,
            data
        };

        if (!callback) {
            this.socket.emit(method, payload);
        }
        else {
            this.socket.emit(method, payload, (data: any) => {
                console.log("==== RESPONSE =====", data);
                callback(data);
            });
        }
    }

    public on(eventName: string, callback: SailsResponseCallback): Sails {
        this.socket.on(eventName, (response) => this._intercept(callback, response));
        return this;
    }

    public off(eventName: string, callback: SailsResponseCallback): Sails {
        this.socket.off(eventName, (response) => this._intercept(callback, response));
        return this;
    }

    private _intercept(callback: SailsResponseCallback, response) {
        // const state = this.sailsOptions.getSocketInterceptor().reduce(
        //     (acc, interceptor) => {
        //         return acc && interceptor(response);
        //     }, true);

        // if (state === true) {
        //     callback(new SailsResponse(response));
        // }
    }
}