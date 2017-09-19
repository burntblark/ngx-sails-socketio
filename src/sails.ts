import { SailsModelInterface } from "./sails.model.interface";
import { SailsOptions } from "./sails.options";
import { SailsQuery } from "./sails.query";
import { Observable } from "rxjs";
import * as SocketIOClient from "socket.io-client";
import * as SailsIOClient from "sails.io.js";
import { Component, OnInit, Injectable } from "@angular/core";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";
import * as _ from "lodash";

declare var window;

@Injectable()
export class Sails {

    constructor(private sailsOptions: SailsOptions) { 
        this.connect();
    }

    private connected(): boolean {
        return window.io.socketpoint.isConnected() || false;
    }

    public connect(): SocketIOClient {
        if (window.io == undefined) {
            window.io = SailsIOClient(SocketIOClient);
            window.io.sails.autoConnect = this.sailsOptions.getAutoConnect();
            window.io.sails.url = this.sailsOptions.getWebsocketUrl();
            window.io.sails.transports = this.sailsOptions.getTransports();
            window.io.sails.useCORSRouteToGetCookie = this.sailsOptions.getUseCORSRouteToGetCookie();
            window.io.sails.headers = this.sailsOptions.getHeaders();
            window.io.sails.timeout = this.sailsOptions.getTimeOut();
            window.io.socketpoint = (window.io.sails && window.io.sails.connect || window.io.connect)(window.io.sails.url);
            window.io.socketpoint.on('connect', () => {
                if (this.sailsOptions.getOnConnectCallback !== null) {
                    this.sailsOptions.getOnConnectCallback();
                }
            });
            window.io.socketpoint.on('disconnect', () => {
                if (this.sailsOptions.getOnDisconnectCallback !== null) {
                    this.sailsOptions.getOnDisconnectCallback();
                }
            });
        } else if (window.io.socketpoint._raw.disconnected) {
            window.io.socketpoint.reconnect();
        }
        window.io.socketpoint.headers = this.sailsOptions.getHeaders();
        return window.io.socketpoint;
    }

    public isConnecting(): boolean {
        return window.io.socketpoint.isConnecting() || false;
    }

    public disconnect(): Sails {
        if (window.io.socketpoint && window.io.socketpoint.isConnected()) {
            window.io.socketpoint.disconnect();
        }
        return this;
    }

    public get(url: string, callback: SailsResponseCallback): void {
        this.connect().get(url, {}, (response) => this._intercept(callback, response));
    }

    public post(url: string, data: object, callback: SailsResponseCallback): void {
        this.connect().post(url, data, (response) => this._intercept(callback, response));
    }

    public put(url: string, data: object, callback: SailsResponseCallback): void {
        this.connect().put(url, data, (response) => this._intercept(callback, response));
    }

    public delete(url: string, callback: SailsResponseCallback): void {
        this.connect().delete(url, {}, (response) => this._intercept(callback, response));
    }

    public on(eventName: string, callback: SailsResponseCallback): any {
        window.io.socketpoint.on(eventName, (response) => this._intercept(callback, response));
    }

    public off(eventName: string, callback: SailsResponseCallback): Sails {
        return window.io.socketpoint.off(eventName, (response) => this._intercept(callback, response));
    }

    private _intercept(callback, response) {
        const state = this.sailsOptions.getSocketInterceptor().reduce(
            (acc, interceptor) => {
                return acc && interceptor(response);
            }, true);

        if (state === true) {
            callback.done(new SailsResponse(response));
        }
    }
}