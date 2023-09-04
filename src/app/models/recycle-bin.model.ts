import { GeneralModel } from "./general.model";
import { Country } from "./country.model";


export class RecycleBin extends GeneralModel {
    id: number;
    tableName: string;
    createdWhen: Date;
    createdBy: number;
    createdByFullName: string;
    createdByUsername: string;
    createdByCode: string;
    idDeleted: number;
    name: string;
    code: string;
    isLoop: boolean;
}