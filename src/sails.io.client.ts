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

    interface JWRBody {
        code: string;
        data: any;
        message: string;
    }

    interface JWR {
        error: any;
        body: JWRBody;
        statusCode: number;
        headers: { [key: string]: string | boolean };
        toString: () => string;
        toPOJO: () => object;
        pipe: () => Error;
    }

    interface Socket {
        _connect(): void;
        reconnect(): any;
        disconnect(): any;
        isConnected(): boolean;
        isConnecting(): boolean;
        mightBeAboutToAutoConnect(): boolean;
        replay(): Socket;
        on(eventName, callback: (response) => void): Socket;
        off(eventName, callback: (response) => void): Socket;
        removeAllListeners(): Socket;
        get(url: string, data: any, callback: (response) => void): void;
        post(url: string, data: any, callback: (response) => void): void;
        put(url: string, data: any, callback: (response) => void): void;
        patch(url: string, data: any, callback: (response) => void): void;
        delete(url: string, data: any, callback: (response) => void): void;
        request(options: { url: string, method?: string, params?: object, headers?: object }, callback: (body: JWRBody, JWR: JWR) => void): void;
    }
}
