import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { SailsIOClient } from "./sails.io.client";
import { SailsInterceptorInterface, SailsInterceptorConstructor } from "./sails.interceptor.interface";
import { SailsOptions } from "./sails.options";
import { isString } from "./utils";

export const SAILS_OPTIONS = new InjectionToken("SAILS_OPTIONS");
export const SAILS_INTERCEPTORS = new InjectionToken("SAILS_INTERCEPTORS");

export const SailsEnvironment = {
    DEV: "dev",
    PROD: "prod"
};

export const SailsListener = {
    CONNECT: "connect",
    CONNECT_ERROR: "connect_error",
    CONNECT_TIMEOUT: "connect_timeout",
    CONNECTING: "connecting",
    RECONNECT: "reconnect",
    DISCONNECT: "disconnect",
};

export class Sails {
    private Socket: SailsIOClient.Socket;
    private Config: SailsConfig;
    private Interceptors: SailsInterceptorInterface[] = [];
    private Listeners: { [eventName: string]: ((data: any) => void)[] } = {
        [SailsListener.CONNECT]: [],
        [SailsListener.CONNECT_ERROR]: [],
        [SailsListener.CONNECT_TIMEOUT]: [],
        [SailsListener.CONNECTING]: [],
        [SailsListener.RECONNECT]: [],
        [SailsListener.DISCONNECT]: [],
    };

    private get socket(): SailsIOClient.Socket {
        return this.Socket;
    }

    private set socket(Socket: SailsIOClient.Socket) {
        this.Socket = Socket;
    }

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(SAILS_OPTIONS) options: SailsOptions,
        @Inject(SAILS_INTERCEPTORS) interceptors: SailsInterceptorConstructor[]) {
        // Set up interceptors
        this.Interceptors = interceptors.map(interceptor => injector.get(interceptor));

        const io: SailsIOClient.IO = SailsIO(SocketIO);
        const socket = io.socket;

        // Helper function for Listeners
        const handleListeners = (eventName: string) => data => this.Listeners[eventName].forEach(callback => callback(data));
        // Set up Event Listeners
        socket.on(SailsListener.CONNECT, handleListeners(SailsListener.CONNECT));
        socket.on(SailsListener.CONNECT_ERROR, handleListeners(SailsListener.CONNECT_ERROR));
        socket.on(SailsListener.CONNECT_TIMEOUT, handleListeners(SailsListener.CONNECT_TIMEOUT));
        socket.on(SailsListener.CONNECTING, handleListeners(SailsListener.CONNECTING));
        socket.on(SailsListener.RECONNECT, handleListeners(SailsListener.RECONNECT));
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

    public request(method: string, url: string, params?: object, headers?: SailsIOClient.JWR.Header): Promise<SailsResponse> {
        const request = { url: this.Config.prefix + url, method, params, headers: Object.assign({}, this.Config.headers, headers) };
        return new Promise(resolve => {
            this.socket.request(request, (body: SailsIOClient.JWR.Body, response: SailsIOClient.JWR.Response) => {
                const resolved = this.intercept(response);
                if (resolved) {
                    resolve(resolved);
                    this.debugReqRes(request, resolved);
                }
            });
        });
    }

    public on(eventName: string): Promise<SailsResponse> {
        return new Promise(resolve => {
            this.socket.on(eventName, response => {
                const resolved = this.intercept(response);
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
                const resolved = this.intercept(response);
                if (resolved) {
                    resolve(resolved);
                    this.debugReqRes(eventName, resolved);
                }
            });
        });
    }

    private intercept(JWR: SailsIOClient.JWR.Response): SailsResponse | void {
        const response = new SailsResponse(JWR);
        const canContinue = this.Interceptors.reduce((acc, interceptor) => {
            return acc && !interceptor.canIntercept(response);
        }, true);

        return canContinue === true ? response : void 0;
    }

    private debugReqRes(request, response) {
        if (this.Config.environment === SailsEnvironment.DEV) {
            console.groupCollapsed("SailsSocketIO: [Request, Response]");
            isString(request) ? console.log(request) : console.dir(request);
            console.dir(response);
            console.groupEnd();
        }
    }
}
