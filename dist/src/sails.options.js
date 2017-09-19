var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
var SailsOptions = /** @class */ (function () {
    function SailsOptions() {
        this.socketInterceptor = new Array();
    }
    SailsOptions.prototype.setWebsocketUrl = function (_webSocketUrl) {
        this.url = _webSocketUrl;
    };
    SailsOptions.prototype.getWebsocketUrl = function () {
        return this.url || "ws://localhost:1337";
    };
    SailsOptions.prototype.setAutoConnect = function (autoConnect) {
        this.autoConnect = autoConnect;
    };
    SailsOptions.prototype.getAutoConnect = function () {
        return this.autoConnect;
    };
    SailsOptions.prototype.setTimeOut = function (duration) {
        this.timeoutDuration = duration || 20000;
    };
    SailsOptions.prototype.getTimeOut = function () {
        return this.timeoutDuration || 20000;
    };
    SailsOptions.prototype.setTransports = function (transports) {
        this.transports = transports;
    };
    SailsOptions.prototype.getTransports = function () {
        return this.transports || ["websocket"];
    };
    SailsOptions.prototype.setUseCORSRouteToGetCookie = function (useCORSRouteToGetCookie) {
        this.useCORSRouteToGetCookie = useCORSRouteToGetCookie;
    };
    SailsOptions.prototype.getUseCORSRouteToGetCookie = function () {
        return this.useCORSRouteToGetCookie || false;
    };
    SailsOptions.prototype.setHeaders = function (_headers) {
        this.headers = _headers;
    };
    SailsOptions.prototype.getHeaders = function () {
        return this.headers || {};
    };
    SailsOptions.prototype.setPrefix = function (_prefix) {
        this.prefix = _prefix;
    };
    SailsOptions.prototype.getPrefix = function () {
        return this.prefix || "";
    };
    SailsOptions.prototype.setSocketInterceptor = function (interceptor) {
        this.socketInterceptor.push(interceptor);
    };
    SailsOptions.prototype.getSocketInterceptor = function () {
        return this.socketInterceptor || [];
    };
    SailsOptions.prototype.setConnectionCallbacks = function (connectedCallback, disConnectedCallback) {
        this.connectedCallback = connectedCallback;
        this.disConnectedCallback = disConnectedCallback;
    };
    ;
    SailsOptions.prototype.getOnConnectCallback = function () {
        return this.connectedCallback;
    };
    ;
    SailsOptions.prototype.getOnDisconnectCallback = function () {
        return this.disConnectedCallback;
    };
    ;
    SailsOptions = __decorate([
        Injectable()
    ], SailsOptions);
    return SailsOptions;
}());
export { SailsOptions };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.options.js.map