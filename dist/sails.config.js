var __SAILS_VERSION__ = "0.11.0";
var __OS_PLATFORM__ = "windows";
var SailsConfig = (function () {
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
export { SailsConfig };
//# sourceMappingURL=sails.config.js.map