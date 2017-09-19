/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Tunde
 */
var SailsResponse = /** @class */ (function () {
    function SailsResponse(raw) {
        if (raw["code"]) {
            this.code = raw["code"];
        }
        if (raw["data"]) {
            this.data = raw["data"];
        }
        if (raw["message"]) {
            this.message = raw["message"];
        }
    }
    SailsResponse.prototype.getCode = function () {
        return this.code;
    };
    SailsResponse.prototype.getData = function () {
        return this.data;
    };
    SailsResponse.prototype.getMessage = function () {
        return this.message;
    };
    return SailsResponse;
}());
export { SailsResponse };
//# sourceMappingURL=/Users/apple/Desktop/ANGULAR/ngx-sails-socketio/src/sails.response.js.map