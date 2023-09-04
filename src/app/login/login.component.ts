import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../services';
import { BaseComponent } from '../shared/components/baseComponent';
import { PermissionService } from '../services/permission.service';
import { Constant } from '../infrastructure/constant';
import { StorageType, PersistenceService } from 'angular-persistence';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styles: []
})
export class LoginComponent extends BaseComponent implements OnInit {

  modalTitle: string;
  bsModalRef: BsModalRef;

  constructor(private authService: AuthService,
    protected messageService: MessageService,
    protected router: Router,
    private modalService: BsModalService,
    private userService: UserService,
    protected permissionService: PermissionService,
    private persistenceService: PersistenceService
  ) {
    super(messageService, permissionService, router);
  }

  public username: string;
  public password: string;
  public evTitle: string;
  public evName: string;
  public evCompany: string;

  logo: string = environment.urlLogo;

  currentPassWord: string;
  newPassWord: string;
  reNewPassWord: string;

  ngOnInit() {
    this.evTitle = environment.title;
    this.evName = environment.name;
    this.evCompany = environment.company;
  }

  async login(template: TemplateRef<any>) {
    // this.authService.login(this.username, this.password);
    const ret = await this.authService.login(this.username, this.password);
    if (ret.isSuccess) {
      const user = ret.data;

      this.persistenceService.set(Constant.auths.userId, user["userId"], { type: StorageType.LOCAL });
      this.persistenceService.set(Constant.auths.userName, user["userName"], { type: StorageType.LOCAL });
      this.persistenceService.set(Constant.auths.fullName, user["userFullName"], { type: StorageType.LOCAL });

      if (user.isPassWordBasic) {
        //the first Login => open Model ResetPassWord
        this.openModelResetPassWord(template);
      } else {
        this.messageService.add({ severity: 'success', detail: 'Đăng nhập thành công.' });
        this.persistenceService.set(Constant.auths.isLoginIn, 'true', { type: StorageType.LOCAL });
        this.persistenceService.set(Constant.auths.token, user["token"], { type: StorageType.LOCAL });

        const routing = "";
        this.router.navigate([routing]);
      }
    } else {
      this.messageService.add({ severity: 'warn', detail: 'Đăng nhập không thành công.' });
    }
  }

  openModelResetPassWord(template: TemplateRef<any>) {
    this.modalTitle = "Đây là lần đăng nhập đầu tiên, vui lòng đổi mật khẩu mới";
    this.bsModalRef = this.modalService.show(template, {
      class: "inmodal animated bounceInRight modal-s"
    });
  }

  async firstResetPassWord() {
    this.messageService.clear();
    if (!this.isValid()) return;
    const res = await this.changePassWord().toPromise();
    if (res) {
      this.bsModalRef.hide();
      const routing = "";
      this.router.navigate([routing]);
    }
  }

  changePassWord(): any {
    if (!this.isValid()) return;
    return this.userService.changePassWord(this.currentPassWord, this.newPassWord).map(
      x => {
        if (!this.isValidResponse(x)) return;
        this.authService.login(this.authService.getUserName(), this.newPassWord);
        this.messageService.add({ severity: Constant.messageStatus.success, detail: "Thay đổi mật khẩu thành công" });
        return true;
      }
    );
  }

  isValid(): boolean {
    if (!this.currentPassWord) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mật khẩu hiện tại" });
      return false;
    } else if (!this.newPassWord) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mật khẩu mới" });
      return false;
    } else if (!this.reNewPassWord) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa xác thực lại mật khẩu mới" });
      return false;
    } else if (this.newPassWord !== this.reNewPassWord) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Mật khẩu xác thực không khớp" });
      return false;
    }

    return true;
  }
}