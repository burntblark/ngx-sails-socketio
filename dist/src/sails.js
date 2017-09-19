var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { connect } from "socket.io-client";
// import * as SocketIOClient from "socket.io-client";
import * as SocketIOClient from "socket.io-client";
import { Injectable } from "@angular/core";
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
        this.socket = connect(url, sailsOptions);
        this.socket.on("connect", function (data) {
            console.log("==== CONNECTED ====");
            console.log(data);
        });
        this.socket.on("connect", handleListeners("connect"));
        this.socket.on("connect_error", handleListeners("connect_error"));
        this.socket.on("connect_timeout", handleListeners("connect_timeout"));
        this.socket.on("connecting", handleListeners("connecting"));
        this.socket.on("reconnect", handleListeners("reconnect"));
        this.socket.on("disconnect", handleListeners("disconnect"));
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
    Sails.prototype.delete = function (url, callback) {
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
        Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], Sails);
    return Sails;
}());
export { Sails };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.js.map