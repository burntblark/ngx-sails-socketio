import { SailsModel, Property, Endpoint } from "ngx-sails-socketio";

class CustomerModel extends SailsModel {
}

@Endpoint("verification")
export class JobModel extends SailsModel {
    @Property({ type: CustomerModel })
    customer: CustomerModel = null;
}

