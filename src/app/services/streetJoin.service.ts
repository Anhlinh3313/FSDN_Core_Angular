import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Ward } from '../models/ward.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { IdViewModel } from '../view-model/index';
import { StreetJoin } from '../models/streetJoin.model';
import { CreateStreet } from '../models/createStreet.model';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class StreetJoinService  extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "streetJoin", messageService);
  }
  
  async getAsync(id: number, arrCols?: string[]): Promise<StreetJoin> {
    const res = await this.get(id).toPromise();
    if (res.isSuccess) {
      const data = res.data as StreetJoin;
      return data;
    } else {
      return null;
    }
  }

  async createAsync(data: any): Promise<StreetJoin> {
    const res = await this.create(data).toPromise();
    if (res.isSuccess) {
      const street = res.data as StreetJoin;
      return street;
    }
  }

  createAddUpdate(data: CreateStreet) {
    let obj = new CreateStreet();
    obj.name = data.name;
    obj.code = data.code;
    obj.provinceId = data.provinceId;
    obj.districtId = data.districtId;
    obj.wardId = data.wardId;
    if (data.streetId) {
      obj.streetId = data.streetId;
    }
    return super.postCustomApi("createAddUpdate", obj);
  }

  async createAddUpdateAsync(data: CreateStreet): Promise<StreetJoin> {
    const res = await this.createAddUpdate(data).toPromise();
    if (res.isSuccess) {
      const streetJoin = res.data as StreetJoin;
      return streetJoin;
    }
  }
}
