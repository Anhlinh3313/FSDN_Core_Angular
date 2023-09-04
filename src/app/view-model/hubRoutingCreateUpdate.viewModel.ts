import { GeneralModel } from "../models/index";

export class HubRoutingCreateUpdateViewModel extends GeneralModel {
    hubId: number;
    userId: number;
    wardIds: number[];
    streetJoinIds?: number[];
}