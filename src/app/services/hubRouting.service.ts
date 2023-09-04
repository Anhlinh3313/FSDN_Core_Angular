import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { HubRouting } from '../models';
import { SortUtil } from '../infrastructure/sort.util';
import { GeneralService } from './general.service';

@Injectable()
export class HubRoutingService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "hubRouting", messageService);
  }

  getHubRoutingByPoHubId(poHubId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("poHubId", poHubId);

    return super.getCustomApi("getHubRoutingByPoHubId", params);
  }

  async getHubRoutingByPoHubIdAsync(poHubId: any): Promise<HubRouting[]> {
    const res = await this.getHubRoutingByPoHubId(poHubId).toPromise();
    if (res.isSuccess) {
        let data = res.data as HubRouting[];
        data = SortUtil.sortAlphanumerical(data, "name");
        return data;
    }
    return null;
  }

  getDatasFromHub(stationHubId: any, hubRoutingId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("stationHubId", stationHubId);
    params = params.append("hubRoutingId", hubRoutingId);

    return super.getCustomApi("getDatasFromHub", params);
  }

  async getDatasFromHubAsync(stationHubId: any, hubRoutingId: any): Promise<ResponseModel> {
    let res = await this.getDatasFromHub(stationHubId, hubRoutingId).toPromise();
    return res;
  }

  create(obj: Object): Observable<ResponseModel> {
    return super.postCustomApi("create", obj);
  }

  update(obj): Observable<ResponseModel> {
    return super.postCustomApi("update", obj);
  }

  getDataStreetJoinByWard(stationHubId: any, hubRoutingId: any, wardIds: string) {
    let params = new HttpParams();
    params = params.append("stationHubId", stationHubId);
    params = params.append("hubRoutingId", hubRoutingId);
    params = params.append("wardIds", wardIds);

    return super.getCustomApi("getDataStreetJoinByWard", params);
  }
}