import { GeneralModel } from "./general.model";
import { Department } from "./department.model";
import { Hub } from "./hub.model";
import { Role } from "./role.model";

export class User extends GeneralModel {
    id:number;
    concurrencyStamp: string;
    isEnabled:boolean;
    roleId:number;
    departmentId:number;
    hubId:number;
    userName:string;
    passWord:string;
    code:string;
    email:string;
    phoneNumber:string;
    address:string;
    avatarBase64:string;
    fullName:string;
    identityCard:string;
    normalizedEmail:string;
    normalizedUserName:string;
    isGlobalAdministrator:boolean;
    isHidden:boolean;
    blockTime: number;
    //
    lat:number;
    lng:number;
    
    department:Department;
    hub:Hub;
    role:Role;
    roleIds:number[];
    roles:Role[];

    vseOracleCode: string;
}