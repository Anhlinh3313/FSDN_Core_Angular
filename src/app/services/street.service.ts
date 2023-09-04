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
export class StreetService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "street", messageService);
  }

  getStreetByName(name: string) {
    let params = new HttpParams();
    params = params.append("name", name);
    return super.getCustomApi("getStreetByName", params);
  }

  async getStreetByNameAsync(name: string): Promise<any> {
    const res = await this.getStreetByName(name).toPromise();
    if (res.isSuccess) {
      const data = res.data as any;
      return data;
    } else {
      return null;
    }
  }

  async createAsync(data: any): Promise<any> {
    const res = await this.create(data).toPromise();
    if (res.isSuccess) {
      const street = res.data as any;
      return street;
    }
  }
}
