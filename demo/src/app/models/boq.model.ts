import { SailsModel, Property, Endpoint } from "ngx-sails-socketio";

class CustomerModel extends SailsModel {
}

@Endpoint("boq")
export class BoqModel extends SailsModel {
    // @Property({ type: CustomerModel })
    // customer: CustomerModel = null;

    @Property()
    status: boolean = null;
}

