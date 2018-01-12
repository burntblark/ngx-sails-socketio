import { SailsModel, Property, Endpoint } from "ngx-sails-socketio";
import { CustomerModel } from "./customer.model";
import { CategoryModel } from "./category.model";
import { FixerModel } from "./fixer.model";

@Endpoint("job")
export class JobModel extends SailsModel {
    @Property({ type: CustomerModel })
    customer: CustomerModel = null;
    @Property({ type: CategoryModel })
    category: CategoryModel = null;
    @Property({ type: FixerModel })
    fixer: FixerModel = null;
    @Property()
    coordinates: number[] = null;
    @Property()
    progress: number = null;
    @Property()
    reference: string = null;
    @Property()
    status: string = null;
    @Property()
    brief: string = null;
}
