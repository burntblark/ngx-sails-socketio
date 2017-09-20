import { SailsModel, Sails, SailsQuery } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { JobModel } from "../models/job.model";

@Injectable()
export class JobsService {
    private query: SailsQuery<JobModel>;

    constructor(private sails: Sails) {
        this.query = new SailsQuery<JobModel>(this.sails, JobModel);
    }

    getActiveJobs() {
        return this.query.findAll();
    }
}
