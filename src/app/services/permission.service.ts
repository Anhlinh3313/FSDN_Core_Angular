import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { RolePage } from '../models/index';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class PermissionService extends BaseService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "permission", messageService);
  }

  public checkPermission(aliasPath: string): Observable<ResponseModel> {
    var params = new HttpParams();
    params = params.append("aliasPath", aliasPath);
    return super.getCustomApi("checkPermission", params);
  }

  public checkPermissionDetail(aliasPath: string, moduleId: any): Observable<ResponseModel> {
    var params = new HttpParams();
    params = params.append("aliasPath", aliasPath);
    params = params.append("moduleId", moduleId);

    return super.getCustomApi("CheckPermissionDetail", params);
  }

  public async checkPermissionAsync(aliasPath: string): Promise<any> {
    let res = await this.checkPermission(aliasPath).toPromise();
    
    if (res.isSuccess) {
      let data = res.data;
      return data;
    }
    return false;
  }

  public getByRoleId(roleId: any): Observable<ResponseModel> {
    var params = new HttpParams();
    params = params.append("roleId", roleId);
    return super.getCustomApi("getByRoleId", params);
  }

  public updatePermission(rolePages: RolePage[]): Observable<ResponseModel> {
    return super.postCustomApi("updatePermission", rolePages);
  }
}
