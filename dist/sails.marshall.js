import { ObjectMapper } from "json-object-mapper";
export function marshalData(clazz, data) {
    var callFn = function (json) {
        var data = ObjectMapper.deserialize(clazz, json);
        return data;
    };
    return Array.isArray(data) ? data.map(callFn) : data instanceof Object ? callFn(data) : data;
}
export function unmarshalData(instance) {
    return ObjectMapper.serialize(instance);
}
export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";
