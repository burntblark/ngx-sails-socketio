import { SailsModel, Sails, SailsQuery, Criteria } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { JobModel } from "../models/job.model";

@Injectable()
export class JobsService {

    constructor(private sails: Sails) {
    }

    getActiveJobs() {
        const query = new SailsQuery<JobModel>(this.sails, JobModel);
        // const criteria = (new Criteria()).whereContains("token", "677487");
        // query.setCriteria(criteria);
        query.addPopulation("customer");
        return query.find();
    }

    getNoCriteria() {
        const query = new SailsQuery<JobModel>(this.sails, JobModel);
        query.find();
    }
}
