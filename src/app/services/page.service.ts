import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectModel } from '../models/select.model';

@Injectable()
export class PageService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "page", messageService);
  }

  public getMenuByModuleId(id: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("id", id);

    return super.getCustomApi("getMenuByModuleId", params);
  }

  public getAllByModuleId(id: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("id", id);

    return super.getCustomApi("getAllByModuleId", params);
  }

  public async getSelectModelGetAllAsync(): Promise<SelectModel[]> {
    const res = await this.getAllAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn menu cha --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: element.name, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }
}