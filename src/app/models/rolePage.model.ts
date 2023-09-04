import { BaseModel } from "./base.model";
import { IBaseModel } from "./abstract/ibaseModel.interface";

export class RolePage implements IBaseModel {
    id: number;
    roleId: number;
    pageId: number;
    isAccess: boolean;
    isAdd: boolean;
    isEdit: boolean;
    isDelete: boolean;
}