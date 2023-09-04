import { GeneralModel } from "./general.model";
import { Hub } from "./hub.model";
import { User } from "./user.model";

export class HubRouting extends GeneralModel {
    hubId: number;
    userId: number;
    hub: Hub;
    user: User;
}