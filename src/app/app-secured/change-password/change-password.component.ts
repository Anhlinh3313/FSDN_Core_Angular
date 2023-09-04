import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { LazyLoadEvent } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { BaseComponent } from '../../shared/components/baseComponent';
import { UserService, AuthService, PermissionService } from '../../services/index';
import { Constant } from '../../infrastructure/constant';
import { KeyCodeUtil } from '../../infrastructure/keyCode.util';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-change-password',
  templateUrl: 'change-password.component.html',
  styles: []
})
export class ChangePassWordComponent extends BaseComponent implements OnInit {

  constructor(protected messageService: MessageService, private userService: UserService, private authService:AuthService, public permissionService: PermissionService, public router: Router) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalSystem.name;
  currentPage: string = Constant.pages.generalSystem.childrens.permission.name;
  currentPassWord: string;
  newPassWord: string;
  reNewPassWord: string;

  ngOnInit() {
    this.initData();
  }

  initData() {
  }

  ngAfterViewInit() {
    // jQuery(document).ready(function () {
    //   jQuery('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    //   });
    //   jQuery('.footable').footable();
    // });
  }

  changePassWord() {
    if (!this.isValid()) return;

    this.userService.changePassWord(this.currentPassWord, this.newPassWord).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.authService.login(this.authService.getUserName(), this.newPassWord);

        this.messageService.add({severity: Constant.messageStatus.success, detail: "Thay đổi mật khẩu thành công"});
        
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

  keyDownFunction(event) {
    if((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.changePassWord();
      event.preventDefault();
      return false;
    }
  }
}
