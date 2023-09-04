import { IBaseModel } from "./ibaseModel.interface";

export interface IBasicModel extends IBaseModel {
    concurrencyStamp: string,
    isEnabled: boolean,
}