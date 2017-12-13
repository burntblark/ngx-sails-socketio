import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { SailsIOClient } from "./sails.io.client";
import { SailsInterceptorConstructor, SailsInterceptorInterface } from "./sails.interceptor";
import { SailsInterceptorHandler, SailsInterceptorHandlerInterface } from "./sails.interceptor.handler";
import { SailsOptions } from "./sails.options";
import { isString } from "./utils";
import { SailsRequestOptions } from "./sails.request.options";

export const SAILS_OPTIONS = new InjectionToken("SAILS_OPTIONS");
export const SAILS_INTERCEPTORS = new InjectionToken("SAILS_INTERCEPTORS");

export const SailsEnvironment = {
    DEV: "development",
    PROD: "production"
};

export const SailsListener = {
    ERROR: "error",
    CONNECT: "connect",
    RECONNECT: "reconnect",
    CONNECTING: "connecting",
    DISCONNECT: "disconnect",
    RECONNECTING: "reconnecting",
    CONNECT_ERROR: "connect_error",
    CONNECT_TIMEOUT: "connect_timeout",
};

export class Sails implements SailsInterceptorInterface, SailsInterceptorHandlerInterface {
    private Socket: SailsIOClient.Socket;
    private Config: SailsConfig;
    private Listeners: { [eventName: string]: ((data: any) => void)[] } = {
        [SailsListener.CONNECT]: [],
        [SailsListener.CONNECT_ERROR]: [],
        [SailsListener.CONNECT_TIMEOUT]: [],
        [SailsListener.CONNECTING]: [],
        [SailsListener.RECONNECT]: [],
        [SailsListener.RECONNECTING]: [],
        [SailsListener.DISCONNECT]: [],
        [SailsListener.ERROR]: [],
    };

    private get socket(): SailsIOClient.Socket {
        return this.Socket;
    }

    private set socket(Socket: SailsIOClient.Socket) {
        this.Socket = Socket;
    }

    constructor(
        @Inject(Injector) private injector: Injector,
        @Inject(SAILS_OPTIONS) options: SailsOptions,
        @Inject(SAILS_INTERCEPTORS) private Interceptors: SailsInterceptorConstructor[] = []) {

        const io: SailsIOClient.IO = SailsIO(SocketIO);
        const socket = io.socket;

        // Helper function for Listeners
        const handleListeners = eventName => data => {
            this.Listeners[eventName].forEach(callback => callback(data));
        };
        // Set up Event Listeners
        socket.on(SailsListener.CONNECT, handleListeners(SailsListener.CONNECT));
        socket.on(SailsListener.CONNECT_ERROR, handleListeners(SailsListener.CONNECT_ERROR));
        socket.on(SailsListener.CONNECT_TIMEOUT, handleListeners(SailsListener.CONNECT_TIMEOUT));
        socket.on(SailsListener.CONNECTING, handleListeners(SailsListener.CONNECTING));
        socket.on(SailsListener.RECONNECT, handleListeners(SailsListener.RECONNECT));
        socket.on(SailsListener.ERROR, handleListeners(SailsListener.ERROR));
        socket.on(SailsListener.RECONNECTING, handleListeners(SailsListener.RECONNECTING));
        socket.on(SailsListener.DISCONNECT, handleListeners(SailsListener.DISCONNECT));

        // Setup Config
        const Config = new SailsConfig(options);
        // Merge Config with Sails
        Object.assign(io.sails, Config);

        this.socket = socket;
        this.Config = Config;
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

    public addEventListener(eventName: string, callback: (data: string) => void): this {
        if (!this.Listeners[eventName]) {
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        this.Listeners[eventName].push(callback);
        return this;
    }

    public removeEventListener(eventName: string, callback): this {
        if (!this.Listeners[eventName]) {
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        if (this.Listeners[eventName].indexOf(callback) > -1) {
            this.Listeners[eventName].splice(this.Listeners[eventName].indexOf(callback), 1);
        }
        return this;
    }

    public on(eventName: string): Promise<SailsResponse> {
        return new Promise(resolve => {
            this.socket.on(eventName, response => {
                // const resolved = this.intercept(response);
                const resolved = response;
                if (resolved) {
                    resolve(resolved);
                    this.debugReqRes(eventName, resolved);
                }
            });
        });
    }

    public off(eventName: string): Promise<SailsResponse> {
        return new Promise(resolve => {
            this.socket.off(eventName, response => {
                // const resolved = this.intercept(response);
                const resolved = response;
                if (resolved) {
                    resolve(resolved);
                    this.debugReqRes(eventName, resolved);
                }
            });
        });
    }

    public request(request: SailsRequestOptions): Promise<SailsResponse> {
        const req = request.clone({
            url: this.Config.prefix + request.url,
        });

        return this.intercept(req);
    }

    async intercept(request: SailsRequestOptions, next: SailsInterceptorHandlerInterface = this): Promise<SailsResponse> {
        const handler = this.Interceptors.reduceRight((next: SailsInterceptorHandlerInterface, interceptor) => {
            return new SailsInterceptorHandler(next, this.injector.get(interceptor));
        }, next);

        return await handler.handle(request);
    }

    async handle(request: SailsRequestOptions): Promise<SailsResponse> {
        return await new Promise<SailsResponse>(resolve => {
            this.socket.request(request.serialize(), (body: SailsIOClient.JWR.Body, response: SailsIOClient.JWR.Response) => {
                const resolved = new SailsResponse(response);
                resolve(resolved);
                this.debugReqRes(request, resolved);
            });
        });
    }

    private debugReqRes(request, response) {
        if (this.Config.environment === SailsEnvironment.DEV) {
            console.groupCollapsed("[SailsSocketIO] > Debug Output");
            isString(request) ? console.log(request) : console.dir(request);
            console.dir(response);
            console.groupEnd();
        }
    }
}
