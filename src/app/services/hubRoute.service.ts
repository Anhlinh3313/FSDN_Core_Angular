import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { DataHubRouteViewModel } from '../view-model';
import { SortUtil } from '../infrastructure/sort.util';

@Injectable()
export class HubRouteService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "hubRoute", messageService);
  }

  public GetHubRouteByWardIds(...params): Observable<ResponseModel> {
    let model = { Ids: params[0], HubId: params[1] };

    return super.postCustomApi("GetHubRouteByWardIds", model);
  }

  async getHubRouteByWardIdsAsync(...params): Promise<any[]> {
    const res = await this.GetHubRouteByWardIds(...params).toPromise();
    if (res.isSuccess) {
      let data = res.data as any[];
      data = SortUtil.sortAlphanumerical(data, "name");
      return data;
    }
    return null;
  }

  public getDatasFromHub(hubId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("hubId", hubId);

    return super.getCustomApi("getDatasFromHub", params);
  }

  async getDatasFromHubAsync(hubId: any): Promise<DataHubRouteViewModel> {
    const res = await this.getDatasFromHub(hubId).toPromise();
    if (res.isSuccess) {
      let data = res.data as DataHubRouteViewModel;
      return data;
    }
    return null;
  }

  public saveChangeHubRoute(hubId: any, wardIds: number[]): Observable<ResponseModel> {
    let obj = new Object();
    obj["hubId"] = hubId;
    obj["wardIds"] = wardIds;

    return super.postCustomApi("saveChangeHubRoute", obj);
  }
}
