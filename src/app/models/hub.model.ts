import { GeneralModel } from "./general.model";
import { District } from "./district.model";
import { Ward } from "./ward.model";
import { Province } from "./province.model";
import { AreaC } from ".";

export class Hub extends GeneralModel {
    email: string;
    phoneNumber: string;
    address: string;
    addressDisplay: string;
    fax: string;
    lat: number;
    lng: number;
    radiusServe: number;
    provinceId: number;
    districtId: number;
    wardId: number;
    areaId: number;
    centerHubId: number;
    poHubId: number;
    province: Province;
    district: District;
    ward: Ward;
    centerHub: Hub;
    poHub: Hub;
    areaC: AreaC;
}