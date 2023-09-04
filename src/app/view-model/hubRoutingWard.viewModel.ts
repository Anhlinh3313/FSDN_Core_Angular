import { District, Ward } from "../models/index";

export class HubRoutingWardViewModel {
    id:number;
    hubId:number;
    wardId:number;
    wardName:string;
    districtId:number;
    districtName:string;
    provinceId:number;
    provinceName:string;
}