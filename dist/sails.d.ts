import { SailsResponse } from "./sails.response";
import { InjectionToken, Injector } from "@angular/core";
import { SailsInterceptorConstructor, SailsInterceptorInterface } from "./sails.interceptor";
import { SailsInterceptorHandlerInterface } from "./sails.interceptor.handler";
import { SailsOptions } from "./sails.options";
import { SailsRequestOptions } from "./sails.request.options";
import { SailsEvent } from "./sails.event";
import { Observable } from "rxjs/Observable";
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
export declare class Sails implements SailsInterceptorInterface, SailsInterceptorHandlerInterface {
    private injector;
    private Interceptors;
    private Socket;
    private Config;
    private Listeners;
    private socket;
    constructor(injector: Injector, options: SailsOptions, Interceptors?: SailsInterceptorConstructor[]);
    connect(): Sails;
    connected(): boolean;
    isConnecting(): Sails;
    disconnect(): Sails;
    addEventListener(eventName: string, callback: (data: string) => void): this;
    removeEventListener(eventName: string, callback: any): this;
    on(eventName: string): Observable<SailsEvent>;
    off(eventName: string): Observable<SailsEvent>;
    request(request: SailsRequestOptions): Observable<SailsResponse>;
    intercept(request: SailsRequestOptions, next?: SailsInterceptorHandlerInterface): Observable<SailsResponse>;
    handle(request: SailsRequestOptions): Observable<SailsResponse>;
    private debugReqRes(request, response);
}
