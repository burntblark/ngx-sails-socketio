import { ObjectMapper } from "json-object-mapper";

export function marshalData<T>(clazz, data: any): T | T[] {
    const callFn = json => {
        const data = ObjectMapper.deserialize(clazz, json);
        return data;
    };

    return Array.isArray(data) ? data.map(callFn) : data instanceof Object ? callFn(data) : data;
}

export function unmarshalData<T>(instance: T): String {
    return ObjectMapper.serialize(instance);
}

export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";