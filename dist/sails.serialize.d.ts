export declare function unserialize<T>(clazz: {
    new (): T;
}, data: any): T;
export declare function serialize<T>(instance: T): String;
export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";
