import { ObjectMapper } from "json-object-mapper";

export function serialize<T>(clazz: { new(): T }, data: any): T {
    return ObjectMapper.deserialize(clazz, data);
}

export function unserialize<T>(instance: T): String {
    return ObjectMapper.serialize(instance);
}

export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";