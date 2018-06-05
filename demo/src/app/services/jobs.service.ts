import { SailsModel, Sails, SailsQuery, RequestCriteria, SailsRequest, SailsResponse, SailsSubscription } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { JobModel } from "../models/job.model";
import { BoqModel } from "../models/boq.model";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

@Injectable()
export class JobsService {

    constructor(private sails: Sails) {
    }

    getQueried(): Observable<BoqModel[]> {
        const req = new SailsRequest(this.sails);
        const criteria = (new RequestCriteria())
            .whereGreaterThan("createdAt", new Date("Fri Sep 29 2017 08:13:03 GMT+0100 (WAT)"));
        // .or()
        // .whereLessThanOrEqualTo("createdAt", new Date("Fri Sep 29 2017 08:13:03 GMT+0100 (WAT)"));

        req.addParam("where", criteria);
        req.addParam("populate", `[${["customer", "createdBy", "job", "category", "fixer"].join(",")}]`)
            .addParam("limit", 25);

        return req.get("/boq").map((response: SailsResponse) => {
            return SailsModel.unserialize(BoqModel, response.getData()) as BoqModel[];
        });
    }

    getJobs() {
        const query = new SailsQuery(this.sails, JobModel);
        query.setPopulation("customer", "fixer", "category");
        return query.find();
    }

    listenOne() {
        return this.getQueried().switchMap(() => {
            return (new SailsSubscription(this.sails)).on("boq").filter(event => event.isUpdated()).switchMap(event => {
                return Observable.of("JUST UPDATED A NEW BOQ");
            });
        });
    }

    listenAll(): Observable<BoqModel[]> {
        return this.getQueried().switchMap(() => {
            return (new SailsSubscription(this.sails)).on("boq").filter(event => event.isCreated()).switchMap(event => {
                console.log("Refreshing...");
                // return Observable.of("JUST CREATED A NEW BOQ");
                return this.getQueried();
            });
        });
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
        return query.update(model.id, model);
    }
}
