import { SailsModel, Sails, SailsQuery, RequestCriteria } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { JobModel } from "../models/job.model";
import { BoqModel } from "../models/boq.model";
import { SailsRequest, SailsResponse } from "ngx-sails-socketio";

@Injectable()
export class JobsService {

    constructor(private sails: Sails) {
    }

    getQueried(): Promise<BoqModel[]> {
        const req = new SailsRequest(this.sails);
        // const criteria = (new RequestCriteria())
        //     .whereGreaterThan("createdAt", new Date(0))
        //     .or()
        //     .whereLessThanOrEqualTo("createdAt", new Date);

        // req.addParam("where", criteria.build());
        req.addParam("populate", `[${["customer", "job", "category", "fixer"].join(",")}]`)
            .addParam("limit", 25);

        return req.get("/boq").then<BoqModel[]>((response: SailsResponse) => {
            if (response.getStatusCode() === 200) {
                // return response.getData();
                return SailsModel.unserialize(BoqModel, response.getData()) as BoqModel[];
            }
            throw response;
        });
    }

    getJobs() {
        const query = new SailsQuery(this.sails, JobModel);
        query.setPopulation("customer", "fixer", "category");
        return query.find();
    }

    getBoqs() {
        const query = new SailsQuery(this.sails, BoqModel);
        const criteria = (new RequestCriteria())
            .whereContains("status", "pending")
            .whereLessThan("createdAt", new Date)
            .or()
            .whereLessThanOrEqualTo("createdAt", new Date);

        query.setRequestCriteria(criteria).setPopulation("customer", "job", "category", "fixer").setLimit(25);
        return query.find();
    }

    saveBoq(model) {
        const query = new SailsQuery(this.sails, BoqModel);
        return query.save(model);
    }

    updateJob(model) {
        const query = new SailsQuery(this.sails, JobModel);
        return query.update(model);
    }
}
