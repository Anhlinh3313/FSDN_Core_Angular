import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { District } from '../models/district.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { GeneralService } from './general.service';
import { IdViewModel } from '../view-model/index';
import { MessageService } from 'primeng/components/common/messageservice';
import { SortUtil } from '../infrastructure/sort.util';
import { SelectModel } from '../models/select.model';

@Injectable()
export class DistrictService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "district", messageService);
  }

  public getDistrictByProvinceId(provinceId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("provinceId", provinceId);

    return super.getCustomApi("getDistrictByProvinceId", params);
  }

  async getDistrictByProvinceIdAsync(provinceId: any): Promise<District[]> {
    const res = await this.getDistrictByProvinceId(provinceId).toPromise();
    if (res.isSuccess) {
      let data = res.data as District[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public getDistrictByProvinceIds(provinceIds: number[], arrCols: string[] = []): Observable<ResponseModel> {
    let obj = new IdViewModel();
    obj.ids = provinceIds;
    obj.cols = arrCols.join(",");

    return super.postCustomApi("getDistrictByProvinceIds", obj);
  }

  async getDistrictByProvinceIdsAsync(provinceIds: number[], arrCols: string[] = []): Promise<District[]> {
    const res = await this.getDistrictByProvinceIds(provinceIds, arrCols).toPromise();
    if (res.isSuccess) {
      let data = res.data as District[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public async getSelectModelDistrictByProvinceIdAsync(provinceId: any): Promise<SelectModel[]> {
    const res = await this.getDistrictByProvinceIdAsync(provinceId);
    let data: SelectModel[] = [];
    if (res) {
      res.forEach(element => {
        data.push({ label: `${element.code} - ${element.name}`, value: element.id, data: element });
      });
      data = SortUtil.sortAlphanumerical(data, "label");
      data.unshift({ label: "-- Chọn quận huyện --", value: null });
      return data;
    } else {
      return null;
    }
  }

  getDistrictByName(name: string, provinceId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if (provinceId) {
      params = params.append("provinceId", provinceId.toString());
    }

    return super.getCustomApi("getDistrictByName", params);
  }

  async getDistrictByNameAsync(name: string, provinceId?: number): Promise<District> {
    const res = await this.getDistrictByName(name, provinceId).toPromise();
    if (res.isSuccess) {
      const data = res.data as District;
      return data;
    }
  }
}
