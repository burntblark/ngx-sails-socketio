import { SailsIOClient } from "./sails.io.client";
export declare const Verb: {
    CREATED: string;
    UPDATED: string;
    ADDED: string;
    DESTROYED: string;
    REMOVED: string;
};
export declare class SailsEvent {
    private JWR;
    constructor(JWR: SailsIOClient.JWR.Event);
    isCreated(): boolean;
    isUpdated(): boolean;
    isDestroyed(): boolean;
    isAdded(): boolean;
    isRemoved(): boolean;
    getVerb(): string;
    getData(): object;
    getId(): string | number;
}
