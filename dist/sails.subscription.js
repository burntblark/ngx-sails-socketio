var SailsSubscription = (function () {
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
export { SailsSubscription };
//# sourceMappingURL=sails.subscription.js.map