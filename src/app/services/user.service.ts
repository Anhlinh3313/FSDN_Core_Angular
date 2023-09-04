import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { AuthService } from './auth/auth.service';
import { SelectModel } from '../models/select.model';
import { User } from '../models';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserFilterModel } from '../models/userFilter.model';

@Injectable()
export class UserService extends GeneralService {
  constructor(protected httpClient: HttpClient, private authService: AuthService, protected messageService: MessageService) {
    super(httpClient, "account", messageService);
  }

  changePassWord(currentPassWord: string, newPassWord: string): Observable<ResponseModel> {
    let model = new Object();
    model["userId"] = this.authService.getUserId();
    model["currentPassWord"] = currentPassWord;
    model["newPassWord"] = newPassWord;
    return super.postCustomApi("changePassWord", model);
  }

  async search(model: UserFilterModel){
    return await super.postCustomApi("search", model).toPromise();
  }

  getEmpByCurrentHub() {
    return super.getCustomApiPaging("getEmpByCurrentHub");
  }

  async getAllRiderInCenterByHubIdAsync(): Promise<User[]> {
    const res = await this.getEmpByCurrentHub().toPromise();
    if (!this.isValidResponse(res)) return;
    const data = res.data as User[];
    return data;
  }

  async getSelectModelEmpByCurrentHubAsync(): Promise<SelectModel[]> {
    const res = await this.getAllRiderInCenterByHubIdAsync();
    const users: SelectModel[] = [];
    users.push({ label: "-- Chọn nhân viên --", value: null });
    if (res) {
      res.forEach((element: User) => {
        users.push({ label: element.code + " - " + element.fullName, value: element.id, data: element });
      });
      return users;
    } else {
      return null;
    }
  }
}