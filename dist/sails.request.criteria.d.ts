export declare class RequestCriteria {
    or(): RequestCriteria;
    whereNotEqualTo(key: string, value: string): RequestCriteria;
    whereLike(key: string, value: string): RequestCriteria;
    whereEqualTo(key: string, value: string): RequestCriteria;
    whereContains(key: string, value: string): RequestCriteria;
    whereIn(key: string, ...value: string[]): RequestCriteria;
    whereStartsWith(key: string, value: string): RequestCriteria;
    whereEndsWith(key: string, value: string): RequestCriteria;
    whereNotIn(key: string, value: string): RequestCriteria;
    whereLessThan(key: string, value: string | number | boolean | Date): RequestCriteria;
    whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): RequestCriteria;
    whereGreaterThan(key: string, value: string | number | boolean | Date): RequestCriteria;
    whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): RequestCriteria;
    private criteria;
    private orCriteria;
    private build();
    toString(): string;
}
