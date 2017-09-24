import { SailsModel, Property, Endpoint } from "ngx-sails-socketio";

@Endpoint("fixer")
export class FixerModel extends SailsModel {
    @Property()
    bankAccount: number = null;
    @Property()
    location: string = null;

    @Property()
    address: string = null;
    @Property()
    firstname: string = null;
    @Property()
    lastname: string = null;
    @Property()
    email: string = null;
    @Property()
    phone: string = null;
    @Property()
    gender: string = null;
    @Property()
    freelancer: boolean = null;
    @Property()
    coordinates: number[] = null;
    @Property()
    totalRating: number = null;
    @Property()
    engaged: false;
    @Property()
    status: string = null;
    @Property()
    fullname: string = null;
    @Property()
    rating: number = null;
}
