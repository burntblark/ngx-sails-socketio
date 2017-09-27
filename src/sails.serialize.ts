import { ObjectMapper } from "json-object-mapper";

export function unserialize<T>(clazz: { new(): T }, data: any): T {
    return ObjectMapper.deserialize(clazz, data);
}

export function serialize<T>(instance: T): String {
    return ObjectMapper.serialize(instance);
}

export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";