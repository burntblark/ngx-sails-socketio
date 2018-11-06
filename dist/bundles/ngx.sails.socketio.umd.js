(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('sails.io.js'), require('socket.io-client'), require('@angular/core'), require('rxjs'), require('json-object-mapper'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define(['exports', 'sails.io.js', 'socket.io-client', '@angular/core', 'rxjs', 'json-object-mapper', 'rxjs/operators'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.amazing = {}),null,null,global.ng.core,null,null,null));
}(this, (function (exports,SailsIO,SocketIO,core,rxjs,jsonObjectMapper,operators) { 'use strict';

    SailsIO = SailsIO && SailsIO.hasOwnProperty('default') ? SailsIO['default'] : SailsIO;

    var SailsResponse = /** @class */ (function () {
        function SailsResponse(JWR) {
            this.JWR = JWR;
        }
        SailsResponse.prototype.isOk = function () {
            return this.getStatusCode() >= 200 && this.getStatusCode() < 300;
        };
        SailsResponse.prototype.isCreated = function () {
            return this.getStatusCode() === 201;
        };
        SailsResponse.prototype.isUnauthorized = function () {
            return this.getStatusCode() === 401;
        };
        SailsResponse.prototype.isForbidden = function () {
            return this.getStatusCode() === 403;
        };
        SailsResponse.prototype.isNotFound = function () {
            return this.getStatusCode() === 404;
        };
        SailsResponse.prototype.isBadRequest = function () {
            return this.getStatusCode() === 400;
        };
        SailsResponse.prototype.isError = function () {
            return this.isClientError() || this.isServerError();
        };
        SailsResponse.prototype.isClientError = function () {
            return this.getStatusCode() >= 400 && !this.isServerError();
        };
        SailsResponse.prototype.isServerError = function () {
            return this.getStatusCode() >= 500;
        };
        SailsResponse.prototype.getCode = function () {
            return this.getBody().code;
        };
        SailsResponse.prototype.getData = function () {
            return this.getBody().data || this.getBody();
        };
        SailsResponse.prototype.getMessage = function () {
            return this.getBody().message;
        };
        SailsResponse.prototype.getBody = function () {
            return this.JWR.body;
        };
        SailsResponse.prototype.getHeaders = function () {
            return this.JWR.headers;
        };
        SailsResponse.prototype.getError = function () {
            return this.JWR.error;
        };
        SailsResponse.prototype.getStatusCode = function () {
            return this.JWR.statusCode;
        };
        SailsResponse.prototype.pipe = function () {
            return this.JWR.pipe();
        };
        SailsResponse.prototype.toPOJO = function () {
            return this.JWR.toPOJO();
        };
        SailsResponse.prototype.toString = function () {
            return this.JWR.toString();
        };
        return SailsResponse;
    }());

    var __SAILS_VERSION__ = "0.11.0";
    var __OS_PLATFORM__ = "windows";
    var SailsConfig = /** @class */ (function () {
        function SailsConfig(options) {
            this.url = "ws://localhost:1337";
            this.query = "__sails_io_sdk_version=" + __SAILS_VERSION__ + "&__sails_io_sdk_platform=" + __OS_PLATFORM__ + "&__sails_io_sdk_language=javascript";
            this.reconnection = true;
            this.autoConnect = true;
            this.transports = ["websocket"];
            this.useCORSRouteToGetCookie = false;
            this.headers = {};
            this.timeout = 20000;
            this.path = "";
            this.prefix = "";
            Object.assign(this, options);
        }
        return SailsConfig;
    }());

    var SailsInterceptorHandler = /** @class */ (function () {
        function SailsInterceptorHandler(next, interceptor) {
            this.next = next;
            this.interceptor = interceptor;
        }
        SailsInterceptorHandler.prototype.handle = function (request) {
            return this.interceptor.intercept(request, this.next);
        };
        return SailsInterceptorHandler;
    }());

    function isUndefined(value) {
        return typeof value === "undefined";
    }
    function isString(value) {
        return typeof value === "string";
    }
    function isEmptyObject(value) {
        return !Object.keys(value).length;
    }
    function isObject(value) {
        return value instanceof Object;
    }

    var Verb = {
        CREATED: "created",
        UPDATED: "updated",
        ADDED: "added",
        DESTROYED: "destroyed",
        REMOVED: "removed",
    };
    var SailsEvent = /** @class */ (function () {
        function SailsEvent(JWR) {
            this.JWR = JWR;
        }
        SailsEvent.prototype.isCreated = function () {
            return this.getVerb() === Verb.CREATED;
        };
        SailsEvent.prototype.isUpdated = function () {
            return this.getVerb() === Verb.UPDATED;
        };
        SailsEvent.prototype.isDestroyed = function () {
            return this.getVerb() === Verb.DESTROYED;
        };
        SailsEvent.prototype.isAdded = function () {
            return this.getVerb() === Verb.ADDED;
        };
        SailsEvent.prototype.isRemoved = function () {
            return this.getVerb() === Verb.REMOVED;
        };
        SailsEvent.prototype.getVerb = function () {
            return this.JWR.verb;
        };
        SailsEvent.prototype.getData = function () {
            return this.JWR.data;
        };
        SailsEvent.prototype.getId = function () {
            return this.JWR.id;
        };
        return SailsEvent;
    }());

    var SAILS_OPTIONS = new core.InjectionToken("SAILS_OPTIONS");
    var SAILS_INTERCEPTORS = new core.InjectionToken("SAILS_INTERCEPTORS");
    var SailsEnvironment = {
        DEV: "development",
        PROD: "production"
    };
    var SailsListener = {
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
            var _a;
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
            return new rxjs.Observable(function (obs) {
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
            return new rxjs.Observable(function (obs) {
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
            return new rxjs.Observable(function (obs) {
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
        /** @nocollapse */
        Sails.ctorParameters = function () { return [
            { type: core.Injector, decorators: [{ type: core.Inject, args: [core.Injector,] }] },
            { type: undefined, decorators: [{ type: core.Inject, args: [SAILS_OPTIONS,] }] },
            { type: Array, decorators: [{ type: core.Inject, args: [SAILS_INTERCEPTORS,] }] }
        ]; };
        return Sails;
    }());

    function unserialize(clazz, data) {
        return jsonObjectMapper.ObjectMapper.deserialize(clazz, data);
    }
    function serialize(instance) {
        return jsonObjectMapper.ObjectMapper.serialize(instance);
    }

    /**
     * Model's Query path Decorator
     * @param path Query Path for Model
     */
    function Endpoint(path) {
        if (path === void 0) { path = ""; }
        return function (target) {
            target.prototype.getEndPoint = function () {
                return path;
            };
        };
    }

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var SailsModel = /** @class */ (function () {
        function SailsModel() {
            this.id = "";
        }
        SailsModel_1 = SailsModel;
        SailsModel.prototype.getEndPoint = function () {
            return this.getEndPoint();
        };
        SailsModel.serialize = function (model) {
            var recr = function (obj) {
                for (var key in obj) {
                    var prop = obj[key];
                    // Ignore NULL values
                    if (prop === null || typeof prop === "function") {
                        delete obj[key];
                    }
                    // Convert Property Models to their ID representations
                    if (prop && prop instanceof SailsModel_1 && prop.id !== null) {
                        obj[key] = prop.id;
                    }
                    if (prop && prop instanceof SailsModel_1) {
                        obj[key] = SailsModel_1.serialize(prop);
                    }
                    if (prop && prop instanceof Array) {
                        obj[key] = prop.map(function (ob) {
                            if (ob instanceof SailsModel_1) {
                                return SailsModel_1.serialize(ob);
                            }
                            return ob;
                        });
                    }
                }
                return obj;
            };
            return recr(Object.assign({}, model));
        };
        SailsModel.unserialize = function (modelClazz, data) {
            var callFn = function (model) { return unserialize(modelClazz, model); };
            if (Array.isArray(data)) {
                return data.map(callFn);
            }
            else if (isObject(data)) {
                return callFn(data);
            }
            throw new Error("SailsModel.unserialize requires a data parameter of either a Literal Object or an Array of Literal Objects");
        };
        var SailsModel_1;
        __decorate([
            jsonObjectMapper.JsonProperty(),
            __metadata("design:type", String)
        ], SailsModel.prototype, "id", void 0);
        __decorate([
            jsonObjectMapper.JsonProperty({ type: Date }),
            __metadata("design:type", Date)
        ], SailsModel.prototype, "createdAt", void 0);
        __decorate([
            jsonObjectMapper.JsonProperty({ type: Date }),
            __metadata("design:type", Date)
        ], SailsModel.prototype, "updatedAt", void 0);
        SailsModel = SailsModel_1 = __decorate([
            Endpoint()
        ], SailsModel);
        return SailsModel;
    }());

    var SailsRequestOptions = /** @class */ (function () {
        function SailsRequestOptions(_a) {
            var url = _a.url, method = _a.method, params = _a.params, headers = _a.headers;
            this.options = { url: url, method: method, params: this.toMap(params), headers: this.toMap(headers) };
        }
        SailsRequestOptions.prototype.clone = function (options) {
            // Strip out undefined values
            for (var name_1 in options) {
                if (!this.options.hasOwnProperty(name_1) || !options[name_1]) {
                    delete options[name_1];
                }
            }
            Object.assign(this.options, options);
            return this;
        };
        SailsRequestOptions.prototype.toMap = function (obj) {
            if (obj === void 0) { obj = {}; }
            var map = new Map;
            Object.keys(obj).forEach(function (k) { return (map.set(k, obj[k])); });
            return map;
        };
        SailsRequestOptions.prototype.toObject = function (map) {
            if (map === void 0) { map = new Map; }
            var obj = {};
            map.forEach(function (v, k) { return (obj[k] = v); });
            return obj;
        };
        Object.defineProperty(SailsRequestOptions.prototype, "method", {
            get: function () {
                return this.options.method;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SailsRequestOptions.prototype, "url", {
            get: function () {
                return this.options.url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SailsRequestOptions.prototype, "params", {
            get: function () {
                return this.options.params;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SailsRequestOptions.prototype, "headers", {
            get: function () {
                return this.options.headers;
            },
            enumerable: true,
            configurable: true
        });
        SailsRequestOptions.prototype.serialize = function () {
            return {
                url: this.url,
                method: this.method,
                params: this.toObject(this.params),
                headers: this.toObject(this.headers)
            };
        };
        return SailsRequestOptions;
    }());

    var QueryBuilder = /** @class */ (function () {
        function QueryBuilder(query) {
            if (query === void 0) { query = ""; }
            this.query = query;
        }
        QueryBuilder.prototype.append = function (criteria) {
            if (typeof criteria === "string") {
                if (this.query.length) {
                    this.query += "&";
                }
                this.query += criteria;
            }
            return this;
        };
        QueryBuilder.prototype.toString = function () {
            if (this.query && this.query.charAt(0) !== "?") {
                this.query = "?" + this.query;
            }
            return this.query;
        };
        return QueryBuilder;
    }());
    var Method = {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete",
        PATCH: "patch",
    };
    var SailsRequest = /** @class */ (function () {
        function SailsRequest(sails) {
            this.sails = sails;
            this.parameters = [];
        }
        SailsRequest.prototype.get = function (url, headers) {
            return this._request(Method.GET, url, headers);
        };
        SailsRequest.prototype.post = function (url, params, headers) {
            return this._request(Method.POST, url, params, headers);
        };
        SailsRequest.prototype.put = function (url, params, headers) {
            return this._request(Method.PUT, url, params, headers);
        };
        SailsRequest.prototype.delete = function (url, headers) {
            return this._request(Method.DELETE, url, headers);
        };
        SailsRequest.prototype.patch = function (url, headers) {
            return this._request(Method.PATCH, url, headers);
        };
        SailsRequest.prototype._request = function (method, url, params, headers) {
            var request = new SailsRequestOptions({ method: method, url: this.buildQuery(url), params: params, headers: headers });
            return this.sails.request(request);
        };
        SailsRequest.prototype.addParam = function (name, value) {
            if (value.toString().length) {
                this.parameters.push(name + "=" + value);
            }
            return this;
        };
        SailsRequest.prototype.getParams = function () {
            return this.parameters.join("&");
        };
        SailsRequest.prototype.buildQuery = function (url) {
            return url + new QueryBuilder(this.getParams());
        };
        return SailsRequest;
    }());

    var RequestCriteria = /** @class */ (function () {
        function RequestCriteria() {
            this.criteria = {};
            this.orCriteria = {};
        }
        RequestCriteria.prototype.or = function () {
            if (isUndefined(this.orCriteria["or"])) {
                this.orCriteria["or"] = [this.criteria];
                this.criteria = {};
                return this;
            }
            if (Array.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            else if (isObject(this.criteria["or"])) {
                this.orCriteria["or"] = [this.criteria];
            }
            this.criteria = {};
            return this;
        };
        RequestCriteria.prototype.whereNotEqualTo = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "!": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["!"])) {
                this.criteria[key]["!"] = value;
                return this;
            }
            throw new Error("DuplicateError: ! clause, use whereNotIn instead");
        };
        RequestCriteria.prototype.whereLike = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "like": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["like"])) {
                this.criteria[key]["like"] = value;
                return this;
            }
            throw new Error("DuplicateError: like clause has already been used in this query");
        };
        RequestCriteria.prototype.whereEqualTo = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = value;
                return this;
            }
            throw new Error("DuplicateError: contains clause has already been used in this query");
        };
        RequestCriteria.prototype.whereContains = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "contains": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["contains"])) {
                this.criteria[key]["contains"] = value;
                return this;
            }
            throw new Error("DuplicateError: contains clause has already been used in this query");
        };
        RequestCriteria.prototype.whereIn = function (key) {
            var value = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                value[_i - 1] = arguments[_i];
            }
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = value;
                return this;
            }
            throw new Error("DuplicateError: contains clause has already been used in this query");
        };
        RequestCriteria.prototype.whereStartsWith = function (key, value) {
            if (isString(this.criteria[key])) {
                this.criteria[key] = { "startsWith": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["startsWith"])) {
                this.criteria[key]["startsWith"] = value;
                return this;
            }
            throw new Error("DuplicateError: startsWith clause has already been used in this query");
        };
        RequestCriteria.prototype.whereEndsWith = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "endsWith": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["endsWith"])) {
                this.criteria[key]["endsWith"] = value;
                return this;
            }
            throw new Error("DuplicateError: endsWith clause has already been used in this query");
        };
        RequestCriteria.prototype.whereNotIn = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "!": [value] };
                return this;
            }
            if (isUndefined(this.criteria[key]["!"])) {
                this.criteria[key]["!"] = [value];
                return this;
            }
            if (Array.isArray(this.criteria[key]["!"])) {
                this.criteria[key]["!"].push(value);
            }
            else {
                this.criteria[key]["!"] = [this.criteria[key]["!"], value];
            }
            return this;
        };
        RequestCriteria.prototype.whereLessThan = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "<": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["<"])) {
                this.criteria[key]["<"] = value;
                return this;
            }
            throw new Error("DuplicateError: < clause has already been used in this query");
        };
        RequestCriteria.prototype.whereLessThanOrEqualTo = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { "<=": value };
                return this;
            }
            if (isUndefined(this.criteria[key]["<="])) {
                this.criteria[key]["<="] = value;
                return this;
            }
            throw new Error("DuplicateError: <= clause has already been used in this query");
        };
        RequestCriteria.prototype.whereGreaterThan = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { ">": value };
                return this;
            }
            if (isUndefined(this.criteria[key][">"])) {
                this.criteria[key][">"] = value;
                return this;
            }
            throw new Error("DuplicateError: > clause has already been used in this query");
        };
        RequestCriteria.prototype.whereGreaterThanOrEqualTo = function (key, value) {
            if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
                this.criteria[key] = { ">=": value };
                return this;
            }
            if (isUndefined(this.criteria[key][">="])) {
                this.criteria[key][">="] = value;
                return this;
            }
            throw new Error("DuplicateError: >= clause has already been used in this query");
        };
        RequestCriteria.prototype.build = function () {
            if (isEmptyObject(this.criteria)) {
                return "";
            }
            var stringify = function (criteria) { return JSON.stringify(criteria); };
            if (!isEmptyObject(this.orCriteria)) {
                if (Array.isArray(this.orCriteria["or"])) {
                    this.orCriteria["or"].push(this.criteria);
                }
                return stringify(this.orCriteria);
            }
            return stringify(this.criteria);
        };
        RequestCriteria.prototype.toString = function () {
            return this.build();
        };
        return RequestCriteria;
    }());

    var SailsQuery = /** @class */ (function () {
        function SailsQuery(sails, modelClass) {
            this.modelClass = modelClass;
            this.errorMsg = "[SailsSocketIO]: the data is not an instance of " + this.modelClass.name + ".\n        You could SailsModel.unserialize(" + this.modelClass.name + ", data) as " + this.modelClass.name + "[] (Array of Models), Or\n        SailsModel.unserialize(" + this.modelClass.name + ", data) as " + this.modelClass.name + " (Single Models)\n        after fetching the data with SailsRequest.";
            this.request = new SailsRequest(sails);
            this.model = new modelClass();
        }
        SailsQuery.prototype.find = function () {
            var _this = this;
            this.request.addParam("where", this.getRequestCriteria());
            return this.request.get("/" + this.model.getEndPoint()).pipe(operators.map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            }));
        };
        SailsQuery.prototype.findById = function (id) {
            var _this = this;
            this.request.addParam("where", this.getRequestCriteria());
            return this.request.get("/" + this.model.getEndPoint() + "/" + id).pipe(operators.map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            }));
        };
        SailsQuery.prototype.save = function (model) {
            var _this = this;
            if (!(model instanceof this.modelClass)) {
                throw new TypeError(this.errorMsg);
            }
            var data = SailsModel.serialize(model);
            var url = "/" + model.getEndPoint();
            if (model.id === null) {
                return this.request.post(url, data).pipe(operators.map(function (res) {
                    if (res.isOk()) {
                        return SailsModel.unserialize(_this.modelClass, res.getData());
                    }
                    throw res;
                }));
            }
            else {
                return this.request.put(url.concat("/", model.id), data).pipe(operators.map(function (res) {
                    if (res.isOk()) {
                        return SailsModel.unserialize(_this.modelClass, res.getData());
                    }
                    throw res;
                }));
            }
        };
        SailsQuery.prototype.update = function (id, model) {
            var _this = this;
            if (model.createdAt) {
                delete model.createdAt;
            }
            if (model.updatedAt) {
                delete model.updatedAt;
            }
            var data = model instanceof SailsModel ? SailsModel.serialize(model) : Object.assign({}, model);
            return this.request.put("/" + this.model.getEndPoint() + "/" + id, data).pipe(operators.map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            }));
        };
        SailsQuery.prototype.remove = function (id) {
            var _this = this;
            return this.request.delete("/" + this.model.getEndPoint() + "/" + id).pipe(operators.map(function (res) {
                if (res.isOk()) {
                    return SailsModel.unserialize(_this.modelClass, res.getData());
                }
                throw res;
            }));
        };
        SailsQuery.prototype.setLimit = function (limit) {
            this.request.addParam("limit", limit);
            return this;
        };
        SailsQuery.prototype.setSort = function (sort) {
            this.request.addParam("sort", sort);
            return this;
        };
        SailsQuery.prototype.setSkip = function (skip) {
            this.request.addParam("skip", skip);
            return this;
        };
        SailsQuery.prototype.setPopulation = function () {
            var population = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                population[_i] = arguments[_i];
            }
            this.request.addParam("populate", "[" + population.join(",") + "]");
            return this;
        };
        SailsQuery.prototype.setRequestCriteria = function (criteria) {
            this.criteria = criteria;
            return this;
        };
        SailsQuery.prototype.getRequestCriteria = function () {
            return this.criteria || new RequestCriteria();
        };
        return SailsQuery;
    }());

    var SailsModule = /** @class */ (function () {
        function SailsModule() {
        }
        SailsModule.forRoot = function (options, interceptors) {
            if (interceptors === void 0) { interceptors = []; }
            return {
                ngModule: SailsModule,
                providers: [
                    Sails
                ].concat(interceptors, [
                    { provide: SAILS_OPTIONS, useValue: options },
                    { provide: SAILS_INTERCEPTORS, useValue: interceptors },
                ])
            };
        };
        SailsModule.decorators = [
            { type: core.NgModule },
        ];
        return SailsModule;
    }());

    var SailsSubscription = /** @class */ (function () {
        function SailsSubscription(sails) {
            this.sails = sails;
        }
        SailsSubscription.prototype.on = function (eventName) {
            return this.sails.on(eventName.toLowerCase());
        };
        SailsSubscription.prototype.off = function (eventName) {
            return this.sails.off(eventName.toLowerCase());
        };
        return SailsSubscription;
    }());

    exports.Ignore = jsonObjectMapper.JsonIgnore;
    exports.Property = jsonObjectMapper.JsonProperty;
    exports.SAILS_OPTIONS = SAILS_OPTIONS;
    exports.SAILS_INTERCEPTORS = SAILS_INTERCEPTORS;
    exports.SailsEnvironment = SailsEnvironment;
    exports.SailsListener = SailsListener;
    exports.Sails = Sails;
    exports.SailsModel = SailsModel;
    exports.SailsQuery = SailsQuery;
    exports.SailsModule = SailsModule;
    exports.Method = Method;
    exports.SailsRequest = SailsRequest;
    exports.SailsSubscription = SailsSubscription;
    exports.SailsResponse = SailsResponse;
    exports.Verb = Verb;
    exports.SailsEvent = SailsEvent;
    exports.unserialize = unserialize;
    exports.serialize = serialize;
    exports.SailsRequestOptions = SailsRequestOptions;
    exports.RequestCriteria = RequestCriteria;
    exports.Endpoint = Endpoint;
    exports.SailsInterceptorHandler = SailsInterceptorHandler;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
