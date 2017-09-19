export interface SailsModelInterface<T> {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;

    // new(): T;

    getEndPoint();
}