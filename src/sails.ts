import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";
import { SailsOptionsFactory } from "./sails.options.factory";
import { Inject, InjectionToken, Injectable } from "@angular/core";
import { SailsIOClient } from "./sails.io.client";

export const SAILS_OPTIONS = new InjectionToken("SAILS_OPTIONS");

@Injectable()
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

    constructor( @Inject(SAILS_OPTIONS) ioOptions: SailsOptionsFactory) {
        const handleListeners = (eventName: string) => data => this.listeners[eventName].forEach(callback => callback(data));
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

    public removeEventListener(eventName, callback) {
        if (!this.listeners[eventName]) {
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        const listeners = this.listeners[eventName];
        const index = listeners.findIndex(cb => cb === callback);
        const newListeners = [...listeners.slice(0, index - 1), ...listeners.slice(index + 1)];
        this.listeners[eventName] = newListeners;
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
        this.socket.request(
            { url, method, headers, params },
            (body: SailsIOClient.JWRBody, response: SailsIOClient.JWR) => {
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