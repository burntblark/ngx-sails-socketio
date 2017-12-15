var SailsSubscription = /** @class */ (function () {
    function SailsSubscription(sails) {
        this.sails = sails;
    }
    SailsSubscription.prototype.on = function (eventName, cb) {
        this.sails.on(eventName.toLowerCase(), cb);
    };
    SailsSubscription.prototype.off = function (eventName) {
        return this.sails.off(eventName.toLowerCase());
    };
    return SailsSubscription;
}());
export { SailsSubscription };
