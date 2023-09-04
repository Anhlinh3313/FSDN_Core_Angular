import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Ward } from '../models/ward.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { IdViewModel } from '../view-model/index';
import { MessageService } from 'primeng/components/common/messageservice';
import { SortUtil } from '../infrastructure/sort.util';
import { SelectModel } from '../models/select.model';

@Injectable()
export class WardService  extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "ward", messageService);
  }

  public getWardByDistrictId(districtId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("districtId", districtId);

    return super.getCustomApi("getWardByDistrictId", params);
  }

  async getWardByDistrictIdAsync(districtId: any): Promise<Ward[]> {
    const res = await this.getWardByDistrictId(districtId).toPromise();
    if (res.isSuccess) {
      let data = res.data as Ward[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public getWardByDistrictIds(districtIds: number[], isHideExistWard: boolean = false, arrCols: string[] = []): Observable<ResponseModel> {
    let obj = new Object();
    obj['ids'] = districtIds;
    obj['isHideExistWard'] = isHideExistWard;
    obj['cols'] = arrCols.join(",");

    return super.postCustomApi("getWardByDistrictIds", obj);
  }

  async getWardByDistrictIdsAsync(districtIds: number[], isHideExistWard: boolean = false, arrCols: string[] = []): Promise<Ward[]> {
    const res = await this.getWardByDistrictIds(districtIds, isHideExistWard, arrCols).toPromise();
    if (res.isSuccess) {
      let data = res.data as Ward[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  getWardByName(name: string, districtId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if(districtId) {
      params = params.append("districtId", districtId.toString());
    }

    return super.getCustomApi("getWardByName", params);
  }

  async getWardByNameAsync(name: string, districtId?: number): Promise<Ward> {
    const res = await this.getWardByName(name, districtId).toPromise();
    if (res.isSuccess) {
      const data = res.data as Ward;
      return data;
    } else {
      return null;
    }
  }

public async getSelectModelWardByDistrictIdAsync(id:any): Promise<SelectModel[]> {
    const res = await this.getWardByDistrictIdAsync(id);
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn phường xã --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label:  `${element.code} - ${element.name}`, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }
}
