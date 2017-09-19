"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var core_1 = require("@angular/core");
var Sails = /** @class */ (function () {
    function Sails(url, sailsOptions) {
        var _this = this;
        this.url = url;
        this.sailsOptions = sailsOptions;
        this.listeners = {
            connect: [],
            connect_error: [],
            connect_timeout: [],
            connecting: [],
            reconnect: [],
            disconnect: []
        };
        this.requestToken = "";
        var handleListeners = function (eventName) { return function (data) { return _this.listeners[eventName].forEach(function (callback) { return callback(data); }); }; };
        var socket = socket_io_client_1.connect(url, sailsOptions);
        socket.on("connect", handleListeners("connect"));
        socket.on("connect_error", handleListeners("connect_error"));
        socket.on("connect_timeout", handleListeners("connect_timeout"));
        socket.on("connecting", handleListeners("connecting"));
        socket.on("reconnect", handleListeners("reconnect"));
        socket.on("disconnect", handleListeners("disconnect"));
        this.socket = socket;
    }
    Object.defineProperty(Sails.prototype, "socket", {
        get: function () {
            return this._socketInstance;
        },
        set: function (_socketInstance) {
            this._socketInstance = _socketInstance;
        },
        enumerable: true,
        configurable: true
    });
    Sails.prototype.connected = function () {
        return this.socket.connected;
    };
    Sails.prototype.connect = function () {
        if (!this.connected()) {
            this.socket.connect();
        }
        return this;
    };
    Sails.prototype.disconnect = function () {
        if (this.connected()) {
            this.socket.disconnect();
        }
        return this;
    };
    Sails.prototype.addEventListener = function (eventName, callback) {
        if (!this.listeners[eventName]) {
            return new Error("The event [" + eventName + "] has not yet been supported by this library.");
        }
        this.listeners[eventName].push(callback);
    };
    /**
     * @todo
     * @param eventName
     */
    Sails.prototype.removeEventListener = function (eventName) {
    };
    Sails.prototype.get = function (url, callback) {
        this.request("get", url, {}, function (response) { return callback(response); });
    };
    Sails.prototype.post = function (url, data, callback) {
        this.request("post", url, data, function (response) { return callback(response); });
    };
    Sails.prototype.put = function (url, data, callback) {
        this.request("put", url, data, function (response) { return callback(response); });
    };
    Sails.prototype["delete"] = function (url, callback) {
        this.request("delete", url, {}, function (response) { return callback(response); });
    };
    Sails.prototype.request = function (method, url, data, callback) {
        if (!this.connected()) {
            this.connect();
        }
        var headers = {
            Authorization: "Bearer " + this.requestToken
        };
        var payload = {
            method: method,
            url: url,
            headers: headers,
            data: data
        };
        if (!callback) {
            this.socket.emit(method, payload);
        }
        else {
            this.socket.emit(method, payload, function (data) {
                console.log("==== RESPONSE =====", data);
                callback(data);
            });
        }
    };
    Sails.prototype.on = function (eventName, callback) {
        var _this = this;
        this.socket.on(eventName, function (response) { return _this._intercept(callback, response); });
        return this;
    };
    Sails.prototype.off = function (eventName, callback) {
        var _this = this;
        this.socket.off(eventName, function (response) { return _this._intercept(callback, response); });
        return this;
    };
    Sails.prototype._intercept = function (callback, response) {
        // const state = this.sailsOptions.getSocketInterceptor().reduce(
        //     (acc, interceptor) => {
        //         return acc && interceptor(response);
        //     }, true);
        // if (state === true) {
        //     callback(new SailsResponse(response));
        // }
    };
    Sails = __decorate([
        core_1.Injectable()
    ], Sails);
    return Sails;
}());
exports.Sails = Sails;
