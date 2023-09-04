import { GeneralModel } from "./general.model";
import { District } from "./district.model";
import { Province, Ward } from ".";
import { Street } from "./street.model";

export class StreetJoin extends GeneralModel {
    provinceId?: number;
    province: Province;
    districtId?: number;
    district: District;
    wardId?: number;
    ward: Ward;
    streetId?: number;
    street: Street;
}