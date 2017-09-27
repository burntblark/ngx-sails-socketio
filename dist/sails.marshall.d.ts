export declare function marshalData<T>(clazz: any, data: any): T | T[];
export declare function unmarshalData<T>(instance: T): String;
export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";
