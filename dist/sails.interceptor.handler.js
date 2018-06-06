var SailsInterceptorHandler = (function () {
    function SailsInterceptorHandler(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
    }
    SailsInterceptorHandler.prototype.handle = function (request) {
        return this.interceptor.intercept(request, this.next);
    };
    return SailsInterceptorHandler;
}());
export { SailsInterceptorHandler };
//# sourceMappingURL=sails.interceptor.handler.js.map