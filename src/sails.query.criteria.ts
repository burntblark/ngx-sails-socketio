import * as _ from "lodash";

export class Criteria {

    private criteria: object = {};

    private orCriteria: object = {};

    private where: string = "";

    private limit: number = 30;

    private sort: string = "";

    private skip: number = 0;

    private population: Array<string> = [];

    private whereFunction(): string {
        if (_.isEmpty(this.criteria)) {
            return null;
        }
        if (!_.isEmpty(this.orCriteria)) {
            if (_.isArray(this.orCriteria['or'])) {
                this.orCriteria['or'].push(this.criteria);
            }
            return "where=" + JSON.stringify(this.orCriteria);
        }
        return "where=" + JSON.stringify(this.criteria);
    }

    public setLimit(limit: number): Criteria {
        this.limit = limit;
        return this;
    }

    public limitFunction(): string {
        if (this.limit == null) {
            return null;
        }
        return "limit=" + this.limit.toString();
    }

    public setSort(sort: string): Criteria {
        this.sort = sort;
        return this;
    }

    public sortFunction(): string {
        if (this.sort == null || _.isEmpty(this.sort)) {
            return null;
        }
        return "sort=" + this.sort;
    }

    public setSkip(skip: number): Criteria {
        this.skip = skip;
        return this;
    }

    public skipFunction(): string {
        if (this.skip == null) {
            return null;
        }
        return "skip=" + this.skip.toString();
    }

    public buildQuery(): string {
        let queryBuilder = "";
        let wherePart = this.whereFunction();
        if (wherePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += '&';
            }
            queryBuilder += wherePart;
        }

        let limitPart = this.limitFunction();
        if (limitPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += '&';
            }
            queryBuilder += limitPart;
        }

        let skipPart = this.skipFunction();
        if (skipPart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += '&';
            }
            queryBuilder += skipPart;
        }

        let populatePart = this.populateFunction();
        if (populatePart != null) {
            if (!_.isEmpty(queryBuilder)) {
                queryBuilder += '&';
            }
            queryBuilder += populatePart;
        }

        if (queryBuilder.charAt(0) != '?') {
            queryBuilder = '?' + queryBuilder;
        }
        return queryBuilder.toString();
    }


    public or(): Criteria {
        if (_.isUndefined(this.orCriteria['or'])) {
            this.orCriteria['or'] = [this.criteria];
            this.criteria = {};
            return this;
        }
        if (_.isArray(this.orCriteria['or'])) {
            this.orCriteria['or'].push(this.criteria);
        } else if (_.isObject(this.criteria['or'])) {
            this.orCriteria['or'] = [this.criteria];
        }
        this.criteria = {};
        return this;
    }

    public populate(value: string): Criteria {
        if (_.isArray(this.population)) {
            this.population.push(value);
        }
        return this;
    }

    private populateFunction(){
        if (this.population == null || _.isEmpty(this.population)) {
            return null;
        }
        return 'populate=[' + _.join(this.population, ',') + ']';
    }

    public whereNotEqualTo(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '!': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['!'])) {
            this.criteria[key]['!'] = value;
            return this;
        }
        throw new Error("DuplicateError: ! clause, use whereNotIn instead");
    }

    public whereLike(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { 'like': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['like'])) {
            this.criteria[key]['like'] = value;
            return this;
        }
        throw new Error("DuplicateError: like clause has already been used in this query");
    }

    public whereContains(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { 'contains': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['contains'])) {
            this.criteria[key]['contains'] = value;
            return this;
        }
        throw new Error("DuplicateError: contains clause has already been used in this query");
    }

    public whereStartsWith(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { 'startsWith': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['startsWith'])) {
            this.criteria[key]['startsWith'] = value;
            return this;
        }
        throw new Error("DuplicateError: startsWith clause has already been used in this query");
    }

    public whereEndsWith(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { 'endsWith': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['endsWith'])) {
            this.criteria[key]['endsWith'] = value;
            return this;
        }
        throw new Error("DuplicateError: endsWith clause has already been used in this query");
    }

    public whereNotIn(key: string, value: string): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '!': [value] };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['!'])) {
            this.criteria[key]['!'] = [value];
            return this;
        }
        if (_.isArray(this.criteria[key]['!'])) {
            this.criteria[key]['!'].push(value);
        } else {
            this.criteria[key]['!'] = [this.criteria[key]['!'], value];
        }
        return this;
    }

    public whereLessThan(key: string, value: string | number | boolean | Date): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '<': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['<'])) {
            this.criteria[key]['<'] = value;
            return this;
        }
        throw new Error("DuplicateError: < clause has already been used in this query");
    }

    public whereLessThanOrEqualTo(key: string, value: string | number | boolean | Date): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '<=': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['<='])) {
            this.criteria[key]['<='] = value;
            return this;
        }
        throw new Error("DuplicateError: <= clause has already been used in this query");
    }

    public whereGreaterThan(key: string, value: string | number | boolean | Date): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '>': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['>'])) {
            this.criteria[key]['>'] = value;
            return this;
        }
        throw new Error("DuplicateError: > clause has already been used in this query");
    }

    public whereGreaterThanOrEqualTo(key: string, value: string | number | boolean | Date): Criteria {
        if (_.isUndefined(this.criteria[key]) || _.isString(this.criteria[key])) {
            this.criteria[key] = { '>=': value };
            return this;
        }
        if (_.isUndefined(this.criteria[key]['>='])) {
            this.criteria[key]['>='] = value;
            return this;
        }
        throw new Error("DuplicateError: >= clause has already been used in this query");
    }

}