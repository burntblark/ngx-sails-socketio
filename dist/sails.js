var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import SailsIO from "sails.io.js";
import * as SocketIO from "socket.io-client";
import { SailsResponse } from "./sails.response";
import { SailsConfig } from "./sails.config";
import { Inject, InjectionToken, Injector } from "@angular/core";
import { SailsInterceptorHandler } from "./sails.interceptor.handler";
import { isString } from "./utils";
import { SailsEvent } from "./sails.event";
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
    Sails.prototype.on = function (eventName, cb) {
        var _this = this;
        this.socket.on(eventName, function (response) {
            if (response) {
                var event_1 = new SailsEvent(response);
                cb(event_1);
                _this.debugReqRes(eventName, event_1);
            }
        });
    };
    Sails.prototype.off = function (eventName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socket.off(eventName, function (response) {
                if (response) {
                    var event_2 = new SailsEvent(response);
                    resolve(event_2);
                    _this.debugReqRes(eventName, event_2);
                }
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
        if (next === void 0) { next = this; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = this.Interceptors.reduceRight(function (next, interceptor) {
                            return new SailsInterceptorHandler(next, _this.injector.get(interceptor));
                        }, next);
                        return [4 /*yield*/, handler.handle(request)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Sails.prototype.handle = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                            _this.socket.request(request.serialize(), function (body, response) {
                                var resolved = new SailsResponse(response);
                                resolve(resolved);
                                _this.debugReqRes(request, resolved);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
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
    /** @nocollapse */
    Sails.ctorParameters = function () { return [
        { type: Injector, decorators: [{ type: Inject, args: [Injector,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [SAILS_OPTIONS,] },] },
        { type: Array, decorators: [{ type: Inject, args: [SAILS_INTERCEPTORS,] },] },
    ]; };
    return Sails;
}());
export { Sails };
