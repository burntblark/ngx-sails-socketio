import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { SailsIOClient } from "./sails.io.client";
import { SailsInterceptorInterface, SailsInterceptorConstructor } from "./sails.interceptor.interface";
import { SailsOptions } from "./sails.options";

export const SAILS_OPTIONS = new InjectionToken("SAILS_OPTIONS");
export const SAILS_INTERCEPTORS = new InjectionToken("SAILS_INTERCEPTORS");

export class Sails {
    private Socket: SailsIOClient.Socket;
    private Config: SailsConfig;
    private Interceptors: SailsInterceptorInterface[] = [];
    private Listeners: { [eventName: string]: ((JSONData: any) => void)[] } = {
        connect: [],
        connect_error: [],
        connect_timeout: [],
        connecting: [],
        reconnect: [],
        disconnect: []
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
        // Helper function for Listeners
        const handleListeners = (eventName: string) => data => this.Listeners[eventName].forEach(callback => callback(data));
        // Setup Config
        const Config = new SailsConfig(options);

        const io: SailsIOClient.IO = SailsIO(SocketIO);
        io.sails.url = Config.url;
        io.sails.query = Config.query;
        io.sails.autoConnect = Config.autoConnect;
        io.sails.transports = Config.transports;
        io.sails.useCORSRouteToGetCookie = Config.useCORSRouteToGetCookie;
        io.sails.headers = Config.headers;
        io.sails.timeout = Config.timeout;
        io.sails.reconnection = Config.reconnection;
        io.sails.environment = Config.environment;
        io.sails.path = Config.path;
        io.sails.initialConnectionHeaders = Config.initialConnectionHeaders;
        io.sails.multiplex = Config.multiplex;
        io.sails.reconnectionAttempts = Config.reconnectionAttempts;
        io.sails.reconnectionDelay = Config.reconnectionDelay;
        io.sails.reconnectionDelayMax = Config.reconnectionDelayMax;
        io.sails.rejectUnauthorized = Config.rejectUnauthorized;
        io.sails.randomizationFactor = Config.randomizationFactor;

        const socket = io.socket;

        socket.on("connect", handleListeners("connect"));
        socket.on("connect_error", handleListeners("connect_error"));
        socket.on("connect_timeout", handleListeners("connect_timeout"));
        socket.on("connecting", handleListeners("connecting"));
        socket.on("reconnect", handleListeners("reconnect"));
        socket.on("disconnect", handleListeners("disconnect"));

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

    public addEventListener(eventName, callback: (data: string) => void): this {
        if (!this.Listeners[eventName]) {
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        this.Listeners[eventName].push(callback);
        return this;
    }

    public removeEventListener(eventName, callback): this {
        if (!this.Listeners[eventName]) {
            throw new Error(`The event [${eventName}] has not yet been supported by this library.`);
        }
        if (this.Listeners[eventName].indexOf(callback) > -1) {
            this.Listeners[eventName].splice(this.Listeners[eventName].indexOf(callback), 1);
        }
        return this;
    }

    public request(method: string, url: string, params?: object): Promise<SailsResponse> {
        return new Promise(resolve => {
            this.socket.request(
                { url: this.Config.prefix + url, method, params },
                (body: SailsIOClient.JWRBody, response: SailsIOClient.JWR) => {
                    const resolved = this.intercept(response);
                    if (resolved) {
                        resolve(resolved);
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
                }
            });
        });
    }

    private intercept(JWR: SailsIOClient.JWR): SailsResponse | void {
        const response = new SailsResponse(JWR);
        const canContinue = this.Interceptors.reduce(
            (acc, interceptor) => {
                return acc && !interceptor.canIntercept(response);
            }, true);

        return canContinue === true ? response : void 0;
    }
}
