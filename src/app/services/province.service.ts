import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Province } from '../models/province.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectModel } from '../models/select.model';

@Injectable()
export class ProvinceService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "province", messageService);
  }
  getProvinceByName(name: string, countryId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if (countryId) {
      params = params.append("countryId", countryId.toString());
    }

    return super.getCustomApi("getProvinceByName", params);
  }

  async getProvinceByNameAsync(name: string, provinceId?: number): Promise<Province> {
    const res = await this.getProvinceByName(name, provinceId).toPromise();
    if (res.isSuccess) {
      const data = res.data as Province;
      return data;
    }
  }

  public async getSelectModelAllAsync(): Promise<SelectModel[]> {
    const res = await this.getAllAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn tỉnh thành --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: `${element.code} - ${element.name}`, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }
}
