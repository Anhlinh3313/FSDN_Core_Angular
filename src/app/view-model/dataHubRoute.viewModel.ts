import { District, Ward } from "../models/index";

export class DataHubRouteViewModel {
    selectedProvinceCiyIds:number[];
    selectedDistrictIds:number[];
    districts: District[];
    wards: Ward[];
}