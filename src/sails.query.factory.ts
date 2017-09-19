import { SailsModelInterface } from "./sails.model.interface";
import { SailsOptions } from "./sails.options";
import { Observable } from "rxjs";
import * as SocketIOClient from "socket.io-client";
import * as SailsIOClient from "sails.io.js";
import { Component, OnInit, Injectable } from "@angular/core";
import { Endpoint } from "./sails.model.decorator";
import { SailsResponseCallback } from "./sails.response.callback";
import { SailsResponse } from "./sails.response";
import * as _ from "lodash";
import { Sails } from "./sails";
import { SailsModel } from "./sails.model";
import { SailsQuery } from "./sails.query";

@Injectable()
export class SailsQueryFactory<T extends SailsModel> {
    constructor(private sails: Sails) { }

    public createQuery(type: typeof SailsModel): SailsQuery<T>{
        return new SailsQuery<T>(this.sails, type);
    }
}