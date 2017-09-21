export interface SailsModelInterface {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;

    getEndPoint: () => string;
}
