import { SailsModel, Sails } from "ngx-sails-socketio";
import { Injectable } from "@angular/core";
import { Endpoint } from "ngx-sails-socketio/src/sails.decorator.endpoint";

@Injectable()
@Endpoint("jobs")
export class JobsService extends SailsModel {

  // For now
  constructor(sails: Sails) {
    super(sails);
  }
}
