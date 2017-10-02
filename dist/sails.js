import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { isString } from "./utils";
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
var Sails = /** @class */ (function () {
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
    Sails.prototype.request = function (method, url, params, headers) {
        var _this = this;
        var request = { url: this.Config.prefix + url, method: method, params: params, headers: Object.assign({}, this.Config.headers, headers) };
        return new Promise(function (resolve) {
            _this.socket.request(request, function (body, response) {
                var resolved = _this.intercept(response);
                if (resolved) {
                    resolve(resolved);
                    _this.debugReqRes(request, resolved);
                }
            });
        });
    };
    Sails.prototype.on = function (eventName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socket.on(eventName, function (response) {
                var resolved = _this.intercept(response);
                if (resolved) {
                    resolve(resolved);
                    _this.debugReqRes(eventName, resolved);
                }
            });
        });
    };
    Sails.prototype.off = function (eventName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socket.off(eventName, function (response) {
                var resolved = _this.intercept(response);
                if (resolved) {
                    resolve(resolved);
                    _this.debugReqRes(eventName, resolved);
                }
            });
        });
    };
    Sails.prototype.addHeader = function (name, value) {
        Object.assign(this.Config.headers, { name: value });
        return this;
    };
    Sails.prototype.removeHeader = function (name) {
        delete this.Config.headers[name];
        return this;
    };
    Sails.prototype.addOption = function (name, value) {
        if (!this.Config[name]) {
            throw new Error("[Sails-SocketIO] Option name (" + name + ") is not available");
        }
        this.Config = new SailsConfig(Object.assign({}, this.Config, { name: value }));
    };
    Sails.prototype.intercept = function (JWR) {
        var _this = this;
        var response = new SailsResponse(JWR);
        var canContinue = this.Interceptors.reduce(function (acc, interceptor) {
            return acc && !(_this.injector.get(interceptor).canIntercept(response));
        }, true);
        return canContinue === true ? response : void 0;
    };
    Sails.prototype.debugReqRes = function (request, response) {
        if (this.Config.environment === SailsEnvironment.DEV) {
            console.groupCollapsed("SailsSocketIO: [Request, Response]");
            isString(request) ? console.log(request) : console.dir(request);
            console.dir(response);
            console.groupEnd();
        }
    };
    /** @nocollapse */
    Sails.ctorParameters = function () { return [
        { type: Injector, decorators: [{ type: Inject, args: [Injector,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [SAILS_OPTIONS,] },] },
        { type: Array, decorators: [{ type: Inject, args: [SAILS_INTERCEPTORS,] },] },
    ]; };
    return Sails;
}());
export { Sails };
