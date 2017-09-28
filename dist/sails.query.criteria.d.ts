export declare class QueryCriteria {
    private criteria;
    private orCriteria;
    build(): string;
    private whereFunction();
    whereNotEqualTo(key: string, value: string): QueryCriteria;
    whereLike(key: string, value: string): QueryCriteria;
    whereEqualTo(key: string, value: string): QueryCriteria;
    whereContains(key: string, value: string): QueryCriteria;
    whereStartsWith(key: string, value: string): QueryCriteria;
    whereEndsWith(key: string, value: string): QueryCriteria;
    whereNotIn(key: string, value: string): QueryCriteria;
    whereLessThan(key: string, value: string | number | boolean | Date): QueryCriteria;
    whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): QueryCriteria;
    whereGreaterThan(key: string, value: string | number | boolean | Date): QueryCriteria;
    whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): QueryCriteria;
    or(): QueryCriteria;
}
