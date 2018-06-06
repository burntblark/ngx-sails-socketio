export declare namespace SailsIOClient {
    interface Headers {
        [key: string]: string | boolean;
    }
    namespace JWR {
        interface Response {
            body: any;
            error: any;
            headers: Headers;
            statusCode: number;
            toString: () => string;
            toPOJO: () => object;
            pipe: () => Error;
        }
        interface Event {
            verb: any;
            id: any;
            data: object;
        }
    }
    interface IO {
        socket: Socket;
        sails: SailsSocket;
    }
    interface Options {
        url: string;
        query: string;
        reconnection: boolean;
        environment: string;
        autoConnect?: boolean;
        useCORSRouteToGetCookie?: boolean;
        transports?: string[];
        path?: string;
        headers?: Headers;
        timeout?: number;
        initialConnectionHeaders?: Headers;
        multiplex?: any;
        reconnectionAttempts?: number;
        reconnectionDelay?: number;
        reconnectionDelayMax?: number;
        rejectUnauthorized?: boolean;
        randomizationFactor?: number;
    }
    interface SailsSocket extends Options {
        connect: (url, opts) => Socket;
    }
    interface RequestOptions {
        url?: string;
        method?: string;
        params?: object;
        headers?: Headers;
    }
    interface EventCallback {
        (response: any): void;
    }
    interface ResponseCallback {
        (body: any, JWR: JWR.Response): void;
    }
    interface Socket {
        _connect(): void;
        reconnect(): any;
        disconnect(): any;
        isConnected(): boolean;
        isConnecting(): boolean;
        mightBeAboutToAutoConnect(): boolean;
        replay(): Socket;
        on(eventName: any, callback: EventCallback): Socket;
        off(eventName: any, callback: EventCallback): Socket;
        removeAllListeners(): Socket;
        get(url: string, data: any, callback: ResponseCallback): void;
        post(url: string, data: any, callback: ResponseCallback): void;
        put(url: string, data: any, callback: ResponseCallback): void;
        patch(url: string, data: any, callback: ResponseCallback): void;
        delete(url: string, data: any, callback: ResponseCallback): void;
        request(options: RequestOptions, callback: ResponseCallback): void;
    }
}
