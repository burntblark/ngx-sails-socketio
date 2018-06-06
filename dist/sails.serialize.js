import { ObjectMapper } from "json-object-mapper";
export function unserialize(clazz, data) {
    return ObjectMapper.deserialize(clazz, data);
}
export function serialize(instance) {
    return ObjectMapper.serialize(instance);
}
export { JsonIgnore as Ignore, JsonProperty as Property } from "json-object-mapper";
//# sourceMappingURL=sails.serialize.js.map