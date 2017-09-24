import { SailsModel, Property, Endpoint } from "ngx-sails-socketio";
import { CustomerModel } from "./customer.model";
import { CategoryModel } from "./category.model";
import { JobModel } from "./job.model";

@Endpoint("boq")
export class BoqModel extends SailsModel {
    @Property({ type: CustomerModel })
    customer: CustomerModel = null;
    @Property({ type: CategoryModel })
    category: CategoryModel = null;
    @Property({ type: JobModel })
    job: JobModel = null;
    @Property()
    status: boolean = null;
}

