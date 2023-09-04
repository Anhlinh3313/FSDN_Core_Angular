import { GeneralModel } from "./general.model";

export class Role extends GeneralModel {
    parrentRoleId:number;
    parrentRole: Role;
}