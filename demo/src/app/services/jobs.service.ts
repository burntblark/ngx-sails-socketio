import { SailsModel, Sails, SailsQuery, RequestCriteria } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { JobModel } from "../models/job.model";
import { BoqModel } from "../models/boq.model";
import { SailsRequest } from "ngx-sails-socketio";

@Injectable()
export class JobsService {

    constructor(private sails: Sails) {
    }

    getActiveJobs(): Promise<BoqModel[]> {
        // const query = new SailsQuery<BoqModel>(this.sails, BoqModel);
        const req = new SailsRequest(this.sails);
        const criteria = (new RequestCriteria());
        // .whereContains("status", "pending");
        // criteria.whereLessThan("createdAt", new Date)
        //     .or()
        //     .whereLessThanOrEqualTo("createdAt", new Date);

        // query.setRequestCriteria(criteria);
        // query.setPopulation("customer");
        // query.setLimit(25);
        // return query.find();
        // req.addParam("body", true);

        return new Promise<BoqModel[]>((resolve, reject) => {
            req.get("/boq", (response) => {
                if (response.getStatusCode() === 200) {
                    return resolve(response.getBody().data);
                }
                reject(response);
            });
        });
    }

    getNoCriteria() {
        const query = new SailsQuery<JobModel>(this.sails, JobModel);
        query.find();
    }
}
