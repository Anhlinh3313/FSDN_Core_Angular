import { GeneralModel } from "./general.model";
import { Province } from "./province.model";

export class District extends GeneralModel {
    provinceId: number;
    province:Province;
    vseOracleCode: string;
}