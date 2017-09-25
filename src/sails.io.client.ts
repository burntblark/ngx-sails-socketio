export declare namespace SailsIOClient {
    interface IO {
        socket: Socket;
        sails: SailsSocket;
    }

    interface Options {
        url: string;
        query: string;
        reconnection: boolean;
        autoConnect?: boolean;
        environment?: string;
        useCORSRouteToGetCookie?: boolean;
        transports?: string[];
        path?: string;
        headers?: { [name: string]: string };
        timeout?: number;
        initialConnectionHeaders?: { [name: string]: string };
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

    namespace JWR {

        interface Body {
            code: string;
            data: any;
            message: string;
        }

        interface Header {
            [key: string]: string | boolean;
        }

        interface Response {
            error: any;
            body: Body;
            headers: Header;
            statusCode: number;
            toString: () => string;
            toPOJO: () => object;
            pipe: () => Error;
        }
    }

    interface RequestOptions {
        url: string;
        method?: string;
        params?: object;
        headers?: JWR.Header;
    }

    interface EventCallback {
        (response): void;
    }

    interface ResponseCallback {
        (body: JWR.Body, JWR: JWR.Response): void;
    }

    interface Socket {
        _connect(): void;
        reconnect(): any;
        disconnect(): any;
        isConnected(): boolean;
        isConnecting(): boolean;
        mightBeAboutToAutoConnect(): boolean;
        replay(): Socket;
        on(eventName, callback: EventCallback): Socket;
        off(eventName, callback: EventCallback): Socket;
        removeAllListeners(): Socket;
        get(url: string, data: any, callback: ResponseCallback): void;
        post(url: string, data: any, callback: ResponseCallback): void;
        put(url: string, data: any, callback: ResponseCallback): void;
        patch(url: string, data: any, callback: ResponseCallback): void;
        delete(url: string, data: any, callback: ResponseCallback): void;
        request(options: RequestOptions, callback: ResponseCallback): void;
    }
}
