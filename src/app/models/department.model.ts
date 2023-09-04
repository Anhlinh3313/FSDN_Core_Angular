import { GeneralModel } from "./general.model";

export class Department extends GeneralModel {
    parrentDepartmentId: any;
    createdBy: any = null;
    createdWhen: any = null;
    modifiedBy: any = null;
    modifiedWhen: any = null;
}