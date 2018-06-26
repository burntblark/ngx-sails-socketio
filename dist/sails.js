import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { SailsInterceptorHandler } from "./sails.interceptor.handler";
import { isString } from "./utils";
import { SailsEvent } from "./sails.event";
import { Observable } from "rxjs/Observable";
export var SAILS_OPTIONS = new InjectionToken("SAILS_OPTIONS");
export var SAILS_INTERCEPTORS = new InjectionToken("SAILS_INTERCEPTORS");
export var SailsEnvironment = {
    DEV: "development",
    PROD: "production"
};
export var SailsListener = {
    ERROR: "error",
    CONNECT: "connect",
    RECONNECT: "reconnect",
    CONNECTING: "connecting",
    DISCONNECT: "disconnect",
    RECONNECTING: "reconnecting",
    CONNECT_ERROR: "connect_error",
    CONNECT_TIMEOUT: "connect_timeout",
};
var Sails = (function () {
    function Sails(injector, options, Interceptors) {
        if (Interceptors === void 0) { Interceptors = []; }
        var _this = this;
        this.injector = injector;
        this.Interceptors = Interceptors;
        this.Listeners = (_a = {},
            _a[SailsListener.CONNECT] = [],
            _a[SailsListener.CONNECT_ERROR] = [],
            _a[SailsListener.CONNECT_TIMEOUT] = [],
            _a[SailsListener.CONNECTING] = [],
            _a[SailsListener.RECONNECT] = [],
            _a[SailsListener.RECONNECTING] = [],
            _a[SailsListener.DISCONNECT] = [],
            _a[SailsListener.ERROR] = [],
            _a);
        var io = SailsIO(SocketIO);
        var socket = io.socket;
        // Helper function for Listeners
        var handleListeners = function (eventName) { return function (data) {
            _this.Listeners[eventName].forEach(function (callback) { return callback(data); });
        }; };
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
        var Config = new SailsConfig(options);
        // Merge Config with Sails
        Object.assign(io.sails, Config);
        this.socket = socket;
        this.Config = Config;
        var _a;
    }
    Object.defineProperty(Sails.prototype, "socket", {
        get: function () {
            return this.Socket;
        },
        set: function (Socket) {
            this.Socket = Socket;
        },
        enumerable: true,
        configurable: true
    });
    Sails.prototype.connect = function () {
        if (!this.connected()) {
            this.socket._connect();
        }
        return this;
    };
    Sails.prototype.connected = function () {
        return this.socket.isConnected();
    };
    Sails.prototype.isConnecting = function () {
        this.socket.isConnecting();
        return this;
    };
    Sails.prototype.disconnect = function () {
        if (this.connected()) {
            this.socket.disconnect();
        }
        return this;
    };
    Sails.prototype.addEventListener = function (eventName, callback) {
        if (!this.Listeners[eventName]) {
            throw new Error("The event [" + eventName + "] has not yet been supported by this library.");
        }
        this.Listeners[eventName].push(callback);
        return this;
    };
    Sails.prototype.removeEventListener = function (eventName, callback) {
        if (!this.Listeners[eventName]) {
            throw new Error("The event [" + eventName + "] has not yet been supported by this library.");
        }
        if (this.Listeners[eventName].indexOf(callback) > -1) {
            this.Listeners[eventName].splice(this.Listeners[eventName].indexOf(callback), 1);
        }
        return this;
    };
    Sails.prototype.on = function (eventName) {
        var _this = this;
        return new Observable(function (obs) {
            _this.socket.on(eventName, function (response) {
                if (response) {
                    var event_1 = new SailsEvent(response);
                    obs.next(event_1);
                    _this.debugReqRes(eventName, event_1);
                }
            });
            return function () { return _this.socket.off(eventName, function () { }); };
        });
    };
    Sails.prototype.off = function (eventName) {
        var _this = this;
        return new Observable(function (obs) {
            _this.socket.off(eventName, function (response) {
                if (response) {
                    var event_2 = new SailsEvent(response);
                    obs.next(event_2);
                    _this.debugReqRes(eventName, event_2);
                }
                return function () { };
            });
        });
    };
    Sails.prototype.request = function (request) {
        var req = request.clone({
            url: this.Config.prefix + request.url,
        });
        return this.intercept(req);
    };
    Sails.prototype.intercept = function (request, next) {
        var _this = this;
        if (next === void 0) { next = this; }
        var handler = this.Interceptors.reduceRight(function (next, interceptor) {
            return new SailsInterceptorHandler(next, _this.injector.get(interceptor));
        }, next);
        return handler.handle(request);
    };
    Sails.prototype.handle = function (request) {
        var _this = this;
        return new Observable(function (obs) {
            _this.socket.request(request.serialize(), function (body, jwr) {
                var response = new SailsResponse(jwr);
                if (response.isError()) {
                    obs.error(response.getError());
                }
                else {
                    obs.next(response.getBody());
                }
                obs.complete();
                _this.debugReqRes(request, response);
            });
        });
    };
    Sails.prototype.debugReqRes = function (request, response) {
        if (this.Config.environment === SailsEnvironment.DEV) {
            console.groupCollapsed("[SailsSocketIO] > Debug Output");
            isString(request) ? console.log(request) : console.dir(request);
            console.dir(response);
            console.groupEnd();
        }
    };
    return Sails;
}());
export { Sails };
/** @nocollapse */
Sails.ctorParameters = function () { return [
    { type: Injector, decorators: [{ type: Inject, args: [Injector,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [SAILS_OPTIONS,] },] },
    { type: Array, decorators: [{ type: Inject, args: [SAILS_INTERCEPTORS,] },] },
]; };
//# sourceMappingURL=sails.js.map