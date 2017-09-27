export declare function serialize<T>(clazz: {
    new (): T;
}, data: any): T;
export declare function unserialize<T>(instance: T): String;
export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";
