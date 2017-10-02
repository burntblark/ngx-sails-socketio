import { SailsResponse } from "./sails.response";
import { InjectionToken, Injector } from "@angular/core";
import { SailsIOClient } from "./sails.io.client";
import { SailsInterceptorConstructor } from "./sails.interceptor.interface";
import { SailsOptions } from "./sails.options";
export declare const SAILS_OPTIONS: InjectionToken<{}>;
export declare const SAILS_INTERCEPTORS: InjectionToken<{}>;
export declare const SailsEnvironment: {
    DEV: string;
    PROD: string;
};
export declare const SailsListener: {
    ERROR: string;
    CONNECT: string;
    RECONNECT: string;
    CONNECTING: string;
    DISCONNECT: string;
    RECONNECTING: string;
    CONNECT_ERROR: string;
    CONNECT_TIMEOUT: string;
};
export declare class Sails {
    private injector;
    private Interceptors;
    private Socket;
    private Config;
    private Listeners;
    private socket;
    constructor(injector: Injector, options: SailsOptions, Interceptors?: SailsInterceptorConstructor[]);
    connect(): Sails;
    private connected();
    isConnecting(): Sails;
    disconnect(): Sails;
    addEventListener(eventName: string, callback: (data: string) => void): this;
    removeEventListener(eventName: string, callback: any): this;
    request(method: string, url: string, params?: object, headers?: SailsIOClient.Headers): Promise<SailsResponse>;
    on(eventName: string): Promise<SailsResponse>;
    off(eventName: string): Promise<SailsResponse>;
    addHeader(name: string, value: any): this;
    removeHeader(name: any): this;
    addOption(name: string, value: any): void;
    private intercept(JWR);
    private debugReqRes(request, response);
}
