import * as SocketIO from "socket.io-client";
import * as SailsIO from "sails.io.js";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";
import { SailsOptionsFactory } from "./sails.options";
import { Injectable, Inject, OpaqueToken } from "@angular/core";

export let SAILS_OPTIONS = new OpaqueToken("sails.io.options");

export interface SailsOptions extends SailsIOClient.Options {
    prefix?: string;
};

export declare namespace SailsIOClient {
    interface IO {
        socket: Socket;
        sails: SailsSocket;
    }

    interface Options {
        url?: string;
        query: string;
        reconnection: boolean;
        autoConnect?: boolean;
        environment?: string;
        useCORSRouteToGetCookie?: boolean;
        transports?: string[];
        path?: string;
        headers?: { [name: string]: string };
        timeout?: number;
        initialConnectionHeaders?: { [name: string]: string };
        multiplex?: any;
        reconnectionAttempts?: number;
        reconnectionDelay?: number;
        reconnectionDelayMax?: number;
        rejectUnauthorized?: boolean;
        randomizationFactor?: number;
    }

    interface SailsSocket extends Options {
        connect: (url, opts) => Socket;
    }

    interface JWRBody {
        code: string;
        data: any;
        message: string;
    }

    interface JWR {
        error: any;
        body: JWRBody;
        statusCode: number;
        headers: { [key: string]: string | boolean };
        toString: () => string;
        toPOJO: () => object;
        pipe: () => Error;
    }

    interface Socket {
        _connect(): void;
        reconnect(): any;
        disconnect(): SocketIOClient.Socket;
        isConnected(): boolean;
        isConnecting(): boolean;
        mightBeAboutToAutoConnect(): boolean;
        replay(): Socket;
        on(eventName, callback: (response) => void): Socket;
        off(eventName, callback: (response) => void): Socket;
        removeAllListeners(): Socket;
        get(url: string, data: object, callback: (response) => void): void;
        post(url: string, data: object, callback: (response) => void): void;
        put(url: string, data: object, callback: (response) => void): void;
        patch(url: string, data: object, callback: (response) => void): void;
        delete(url: string, data: object, callback: (response) => void): void;
        request(options: { url: string, method?: string, params?: object, headers?: object }, callback: (response, JWR?) => void): void;
    }
}

// @Injectable()
export class Sails {
    private _socketInstance: SailsIOClient.Socket;
    private config: SailsOptionsFactory;
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

    private get socket(): SailsIOClient.Socket {
        return this._socketInstance;
    }

    private set socket(_socketInstance: SailsIOClient.Socket) {
        this._socketInstance = _socketInstance;
    }

    constructor( @Inject(SAILS_OPTIONS) private ioOptions: SailsOptionsFactory) {
        const handleListeners = eventName => data => this.listeners[eventName].forEach(callback => callback(data));
        const options = new SailsOptionsFactory(ioOptions);

        const io: SailsIOClient.IO = SailsIO(SocketIO);
        io.sails.url = options.url;
        io.sails.query = options.query;
        io.sails.autoConnect = options.autoConnect;
        io.sails.transports = options.transports;
        io.sails.useCORSRouteToGetCookie = options.useCORSRouteToGetCookie;
        io.sails.headers = options.headers;
        io.sails.timeout = options.timeout;
        io.sails.reconnection = options.reconnection;
        io.sails.environment = options.environment;
        io.sails.path = options.path;
        io.sails.initialConnectionHeaders = options.initialConnectionHeaders;
        io.sails.multiplex = options.multiplex;
        io.sails.reconnectionAttempts = options.reconnectionAttempts;
        io.sails.reconnectionDelay = options.reconnectionDelay;
        io.sails.reconnectionDelayMax = options.reconnectionDelayMax;
        io.sails.rejectUnauthorized = options.rejectUnauthorized;
        io.sails.randomizationFactor = options.randomizationFactor;

        const socket = io.socket;

        socket.on("connect", handleListeners("connect"));
        socket.on("connect_error", handleListeners("connect_error"));
        socket.on("connect_timeout", handleListeners("connect_timeout"));
        socket.on("connecting", handleListeners("connecting"));
        socket.on("reconnect", handleListeners("reconnect"));
        socket.on("disconnect", handleListeners("disconnect"));

        this.socket = socket;
        this.config = options;
    }

    public connect(): Sails {
        if (!this.connected()) {
            this.socket._connect();
        }

        return this;
    }

    private connected(): boolean {
        return this.socket.isConnected();
    }

    public isConnecting(): Sails {
        this.socket.isConnecting();
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
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
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

    public request(method: string, url: string, params: object, callback: SailsResponseCallback) {
        const headers = {
            Authorization: "Bearer " + this.requestToken
        };
        url = this.config.prefix + url;
        this.socket.request({ url, method, headers, params }, (body, response) => {
            return callback(new SailsResponse(response));
        });
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
        return callback;
        // const state = this.sailsOptions.getSocketInterceptor().reduce(
        //     (acc, interceptor) => {
        //         return acc && interceptor(response);
        //     }, true);

        // if (state === true) {
        //     callback(new SailsResponse(response));
        // }
    }
}