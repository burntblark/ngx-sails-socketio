import { clone, isUndefined, isString, isEmpty, isArray, isObject } from "lodash";

export class Criteria {

    private criteria: object = {};

    private orCriteria: object = {};

    private where: string = "";

    public build(): string {
        let queryBuilder = "";
        let wherePart = this.whereFunction();
        if (wherePart != null) {
            if (!isEmpty(queryBuilder)) {
                queryBuilder += "&";
            }
            queryBuilder += wherePart;
        }
        return queryBuilder;
    }

    private whereFunction(): string {
        if (isEmpty(this.criteria)) {
            return null;
        }
        if (!isEmpty(this.orCriteria)) {
            if (isArray(this.orCriteria["or"])) {
                this.orCriteria["or"].push(this.criteria);
            }
            return "where=" + JSON.stringify(this.orCriteria);
        }
        return "where=" + JSON.stringify(this.criteria);
    }

    public whereNotEqualTo(key: string, value: string): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    }

    public whereLike(key: string, value: string): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "like" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["like"])) {
            this.criteria[key]["like"] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    }

    public whereContains(key: string, value: string): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "contains" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["contains"])) {
            this.criteria[key]["contains"] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    }

    public whereStartsWith(key: string, value: string): Criteria {
        if (isString(this.criteria[key])) {
            this.criteria[key] = { "startsWith" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["startsWith"])) {
            this.criteria[key]["startsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    }

    public whereEndsWith(key: string, value: string): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "endsWith" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["endsWith"])) {
            this.criteria[key]["endsWith"] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    }

    public whereNotIn(key: string, value: string): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "!" : [value] };
            return this;
        }
        if (isUndefined(this.criteria[key]["!"])) {
            this.criteria[key]["!"] = [value];
            return this;
        }
        if (isArray(this.criteria[key]["!"])) {
            this.criteria[key]["!"].push(value);
        } else {
            this.criteria[key]["!"] = [this.criteria[key]["!"], value];
        }
        return this;
    }

    public whereLessThan(key: string, value: string | number | boolean | Date): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<"])) {
            this.criteria[key]["<"] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    }

    public whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { "<=" : value };
            return this;
        }
        if (isUndefined(this.criteria[key]["<="])) {
            this.criteria[key]["<="] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    }

    public whereGreaterThan(key: string, value: string | number | boolean | Date): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">" : value };
            return this;
        }
        if (isUndefined(this.criteria[key][">"])) {
            this.criteria[key][">"] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    }

    public whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): Criteria {
        if (isUndefined(this.criteria[key]) || isString(this.criteria[key])) {
            this.criteria[key] = { ">=" : value };
            return this;
        }
        if (isUndefined(this.criteria[key][">="])) {
            this.criteria[key][">="] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    }
}