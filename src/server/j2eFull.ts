import json2emap from "json2emap";
import _ from "lodash";

const isArray = (json: any) => Array.isArray(json);
const isMap = (json: any) => _.isPlainObject(json);

const resolveKey = (prefix: any, key: any) =>
  prefix ? `${prefix}.${key}` : key;

const resolveArrayKey = (prefix: any, key: any) =>
  prefix ? `${prefix}_${key}_` : `_${key}_`;

const resolveIterator = (
  func: any,
  resolveKeyFunc: any,
  json: any,
  prefix: any
) => _.flatMap(json, (value, key) => func(value, resolveKeyFunc(prefix, key)));

function resolveType(value: any) {
  return _.isNumber(value)
    ? "number"
    : _.isString(value)
    ? "string"
    : _.isBoolean(value)
    ? "bool"
    : "any";
}

const resolveValue = (
  value: any,
  key: any,
  overRideType: any,
  resolveTypeFunc = resolveType
) => ({
  value: value === null ? "null" : value,
  key: key,
  type: overRideType ? overRideType : resolveTypeFunc(value),
});

export function resolveMap(
  json: any,
  key = "",
  resolveTypeFunc: any = resolveType
) {
  return isMap(json)
    ? resolveIterator(resolveMap, resolveKey, json, key)
    : isArray(json)
    ? [
        resolveValue(
          Object.keys(json).length,
          resolveKey(key, "length"),
          "number",
          resolveTypeFunc
        ),
        ...resolveIterator(resolveMap, resolveArrayKey, json, key),
      ]
    : resolveValue(json, key, undefined, resolveTypeFunc);
}

export function json2emapFull(data: any) {
  return json2emap({ schema: resolveMap(data), data });
}
