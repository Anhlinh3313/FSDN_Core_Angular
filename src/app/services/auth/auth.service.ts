import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Constant } from '../../infrastructure/constant';
import { User } from '../../models/user.model';
import { ResponseModel } from '../../models';
import { BaseService } from '../base.service';

@Injectable()
export class AuthService extends BaseService {

  constructor(
    protected persistenceService: PersistenceService,
    protected httpClient: HttpClient,
    private router: Router,
    protected messageService: MessageService
    ) {
    super(httpClient, "Account", messageService);
  }

  public isLoggedIn(): boolean {
    var isLogged = this.persistenceService.get(Constant.auths.isLoginIn, StorageType.LOCAL);
    if (isLogged == 'true') {
      return true;
    }
    return false;
  }

  async login(userName: string, password: string): Promise<ResponseModel> {
    var loginObj = new Object();
    loginObj["userName"] = userName;
    loginObj["passWord"] = password;
    let ret = await this.postCustomApi("SignIn", loginObj).toPromise();
    return ret;
  }

  public logout() {
    this.persistenceService.remove(Constant.auths.isLoginIn, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.token, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.userId, StorageType.LOCAL);
    this.persistenceService.remove(Constant.auths.userName, StorageType.LOCAL);
    var routing = Constant.pages.login.alias;
    this.router.navigate([routing]);
  }

  public getToken(): string {
    return this.persistenceService.get(Constant.auths.token, StorageType.LOCAL);
  }

  public getUserId(): number {
    return this.persistenceService.get(Constant.auths.userId, StorageType.LOCAL);
  }

  public getUserName(): string {
    return this.persistenceService.get(Constant.auths.userName, StorageType.LOCAL);
  }

  public getFullName(): string {
    return this.persistenceService.get(Constant.auths.fullName, StorageType.LOCAL);
  }
}
