import { isUndefined, isString, isEmptyObject, isObject } from "./utils";

export class RequestCriteria {
    private criteria: object = {};
    private orCriteria: object = {};

    private build(): string {
        if (isEmptyObject(this.criteria)) {
            return "";
        }
        const stringify = criteria => JSON.stringify(criteria);

        if (!isEmptyObject(this.orCriteria)) {
            if (Array.isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return stringify(this.orCriteria);
        }
        return stringify(this.criteria);
    }

    public whereNotEqualTo(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    }

    public whereLike(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "like": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["like"])) {
            this.criteria[key]["like"] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    }

    public whereEqualTo(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    }

    public whereContains(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "contains": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["contains"])) {
            this.criteria[key]["contains"] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    }

    public whereStartsWith(key: string, value: string): RequestCriteria {
        if (isString(this.criteria[key])) {
            this.criteria[key] = { "startsWith": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["startsWith"])) {
            this.criteria[key]["startsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    }

    public whereEndsWith(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "endsWith": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["endsWith"])) {
            this.criteria[key]["endsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    }

    public whereNotIn(key: string, value: string): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!": [value] };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = [value];
            return this;
        }
        if (Array.isArray(this.criteria[key]["!"])) {
            this.criteria[key]["!"].push(value);
        } else {
            this.criteria[key]["!"] = [this.criteria[key]["!"], value];
        }
        return this;
    }

    public whereLessThan(key: string, value: string | number | boolean | Date): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<"])) {
            this.criteria[key]["<"] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    }

    public whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<=": value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<="])) {
            this.criteria[key]["<="] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    }

    public whereGreaterThan(key: string, value: string | number | boolean | Date): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">": value };
            return this;
        }
        if (isUndefined(this.criteria[key][">"])) {
            this.criteria[key][">"] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    }

    public whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): RequestCriteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">=": value };
            return this;
        }
        if (isUndefined(this.criteria[key][">="])) {
            this.criteria[key][">="] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    }

    public or(): RequestCriteria {
        if (isUndefined(this.orCriteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (Array.isArray(this.orCriteria["or"])) {
            this.orCriteria["or"].push(this.criteria);
        } else if (isObject(this.criteria["or"])) {
            this.orCriteria["or"] = [this.criteria];
        }
        this.criteria = {};
        return this;
    }

    public toString() {
        return this.build();
    }
}