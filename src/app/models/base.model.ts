import { IBaseModel } from "./abstract/ibaseModel.interface";

export class BaseModel implements IBaseModel {
    id: number;

     constructor(id: number = null) {
        this.id = id;
     }
}