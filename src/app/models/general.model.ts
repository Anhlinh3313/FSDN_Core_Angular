import { IGeneralModel } from "./abstract/igeneralModel.interface";

export class GeneralModel implements IGeneralModel {
    code: string;
    name: string;
    concurrencyStamp: string;
    isEnabled: boolean = true;
    id: number;
}