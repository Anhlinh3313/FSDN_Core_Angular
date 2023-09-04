import { StreetJoin } from "./streetJoin.model";

export class StreetJoinByWard extends StreetJoin {
    provincetName: string;
    districtName: string;
    wardtName: string;
    streetName: string;
    hubId: number;
    hubRoutingId: number;
}