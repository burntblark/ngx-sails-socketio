export var Verb = {
    CREATED: "created",
    UPDATED: "updated",
    ADDED: "added",
    DESTROYED: "destroyed",
    REMOVED: "removed",
};
var SailsEvent = (function () {
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
export { SailsEvent };
//# sourceMappingURL=sails.event.js.map