export interface SailsModelInterface {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    getEndPoint: () => string;
}
