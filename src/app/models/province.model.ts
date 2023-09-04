import { GeneralModel } from "./general.model";
import { Country } from "./country.model";


export class Province extends GeneralModel {
    countryId: number;
    country: Country;
    vseOracleCode
}