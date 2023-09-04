import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { SortUtil } from '../infrastructure/sort.util';
import { SelectModel } from '../models/select.model';

@Injectable()
export class HubService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "hub", messageService);
  }

  public getCenterHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getCenterHub", arrCols);
  }


  // public async getCenterHubAsync(): Promise<Hub[]> {
  //   const res = await this.getCenterHub().toPromise();
  //   if (res.isSuccess) {
  //     const data = res.data as Hub[];
  //     return data;
  //   }
  //   return null;
  // }

  public async getSelectModelCenterHubAsync(): Promise<SelectModel[]> {
    const res = await this.getCenterHubAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn trung tâm --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: `${element.code} - ${element.name}`, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }

  async getCenterHubAsync(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Promise<Hub[]> {
    const res = await this.getCenterHub(arrCols, pageSize, pageNumber).toPromise();
    if (res.isSuccess) {
        let data = res.data as Hub[];
        data = SortUtil.sortAlphanumerical(data, "name");
        return data;
    }
    return null;
  }

  public getPoHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getPoHub", arrCols);
  }

  async getPoHubAsync(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Promise<Hub[]> {
    const res = await this.getPoHub(arrCols, pageSize, pageNumber).toPromise();
    if (res.isSuccess) {
      let data = res.data as Hub[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public async getSelectModelPoHubAsync(): Promise<SelectModel[]> {
    const res = await this.getPoHubAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn chi nhánh --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: element.name, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }

  public getPoHubByCenterId(centerId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("centerId", centerId);

    return super.getCustomApiPaging("getPoHubByCenterId", arrCols, params);
  }

  async getPoHubByCenterIdAsync(centerId: any, arrCols: string[] = []): Promise<Hub[]> {
    const res = await this.getPoHubByCenterId(centerId, arrCols).toPromise();
    if (res.isSuccess) {
      let data = res.data as Hub[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public async getSelectModelPoHubByCenterIdbAsync(centerId: any, arrCols: string[] = []): Promise<SelectModel[]> {
    const res = await this.getPoHubByCenterIdAsync(centerId, arrCols);
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn chi nhánh --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label:  `${element.code} - ${element.name}`, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }

  public getStationHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getStationHub", arrCols);
  }

  async getStationHubAsync(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Promise<Hub[]> {
    const res = await this.getStationHub(arrCols, pageSize, pageNumber).toPromise();
    if (res.isSuccess) {
      let data = res.data as Hub[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public async getSelectModelStationHubbAsync(): Promise<SelectModel[]> {
    const res = await this.getStationHubAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn chi nhánh --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: element.name, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }

  public getStationHubByPoId(poId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("poId", poId);

    return super.getCustomApiPaging("getStationHubByPoId", arrCols, params);
  }

  async getStationHubByPoIdAsync(poId: any, arrCols: string[] = []): Promise<Hub[]> {
    const res = await this.getStationHubByPoId(poId, arrCols).toPromise();
    if (res.isSuccess) {
      let data = res.data as Hub[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public async getSelectModelAsync(poId: any, arrCols: string[] = []): Promise<SelectModel[]> {
    const res = await this.getStationHubByPoIdAsync(poId, arrCols);
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn trạm --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: element.name, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }

  ////
  public getListHubByWardId(wardId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("wardId", wardId);

    return super.getCustomApiPaging("getListHubByWardId", arrCols, params);
  }

  async getListHubByWardIdAsync(wardId: any, arrCols: string[] = []): Promise<Hub[]> {
    const res = await this.getListHubByWardId(wardId, arrCols).toPromise();
    if (res.isSuccess) {
      let data = res.data as Hub[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }
}
