import { SailsIOClient } from "./sails.io.client";

export const Verb = {
    CREATED: "created",
    UPDATED: "updated",
    ADDED: "added",
    DESTROYED: "destroyed",
    REMOVED: "removed",
};

export class SailsEvent {
    constructor(private JWR: SailsIOClient.JWR.Event) { }

    public isCreated(): boolean {
        return this.getVerb() === Verb.CREATED;
    }

    public isUpdated(): boolean {
        return this.getVerb() === Verb.UPDATED;
    }

    public isDestroyed(): boolean {
        return this.getVerb() === Verb.DESTROYED;
    }

    public isAdded(): boolean {
        return this.getVerb() === Verb.ADDED;
    }

    public isRemoved(): boolean {
        return this.getVerb() === Verb.REMOVED;
    }

    public getVerb(): string {
        return this.JWR.verb;
    }

    public getData(): object {
        return this.JWR.data;
    }

    public getId(): string | number {
        return this.JWR.id;
    }
}
