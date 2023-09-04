import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { LazyLoadEvent } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { Subscription, Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { UserService, ModulePageService, RoleService, PageService, PermissionService } from '../../../services/index';
import { Constant } from '../../../infrastructure/constant';
import { ModulePage, Role, Page, RolePage } from '../../../models/index';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SelectModel } from '../../../models/select.model';

declare var jQuery: any;

@Component({
  selector: 'app-permission',
  templateUrl: 'permission.component.html',
  styles: [`
  agm-map {
    height: 700px;
  }
  `]
})
export class PermissionComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  parentPage: string = Constant.pages.generalSystem.name;
  currentPage: string = Constant.pages.generalSystem.childrens.permission.name;
  //
  modulePages: SelectModel[];
  selectedModulePage: number;
  //
  roles: SelectModel[];
  selectedRole: number;
  // 
  pages: Page[] = [];

  constructor(
    protected messageService: MessageService,
    private userService: UserService,
    private modalService: BsModalService,
    private modulePageService: ModulePageService,
    private roleService: RoleService,
    public permissionService: PermissionService,
    private pageService: PageService, public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  async ngOnInit() {
    const modulePages = await this.modulePageService.getSelectModelAllAsync();
    if (modulePages) {
      this.modulePages = modulePages;
    }

    const roles = await this.roleService.getSelectModelAsync();
    if (roles) {
      this.roles = roles;
    }
  }

  ngAfterViewInit() {
    jQuery(document).ready(function () {
      jQuery('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });
      jQuery('.footable').footable();
    });
  }

  loadDefaultRolePage() {
    this.pages.forEach(element => {
      var rolePage = new RolePage();
      rolePage.id = 0;
      rolePage.pageId = element.id;
      rolePage.roleId = null;
      rolePage.isAccess = false;
      rolePage.isAdd = false;
      rolePage.isDelete = false;
      rolePage.isEdit = false;
      element.rolePage = rolePage;

      element.children.forEach(child => {
        var rolePage = new RolePage();
        rolePage.id = 0;
        rolePage.pageId = child.id;
        rolePage.roleId = null;
        rolePage.isAccess = false;
        rolePage.isAdd = false;
        rolePage.isDelete = false;
        rolePage.isEdit = false;
        child.rolePage = rolePage;
      });
    });
  }

  changeModulePage() {
    this.pages = [];
    this.selectedRole = null;

    if (!this.selectedModulePage)
      return;

    this.pageService.getAllByModuleId(this.selectedModulePage).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        var pages = x.data as Page[];

        pages.forEach(element => {
          if (!element.parentPageId) {
            element.children = pages.filter(x => x.parentPageId === element.id);
            //
            var rolePage = new RolePage();
            rolePage.id = 0;
            rolePage.pageId = element.id;
            rolePage.roleId = null;
            rolePage.isAccess = false;
            rolePage.isAdd = false;
            rolePage.isDelete = false;
            rolePage.isEdit = false;
            element.rolePage = rolePage;

            element.children.forEach(child => {
              var rolePage = new RolePage();
              rolePage.id = 0;
              rolePage.pageId = child.id;
              rolePage.roleId = null;
              rolePage.isAccess = false;
              rolePage.isAdd = false;
              rolePage.isDelete = false;
              rolePage.isEdit = false;
              child.rolePage = rolePage;
            });
            //
            this.pages.push(element);
          }
        });
      }
    );
  }

  changeRole() {
    this.loadDefaultRolePage();

    if (!this.selectedRole)
      return;

    this.permissionService.getByRoleId(this.selectedRole).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        var rolePages = x.data as RolePage[];

        this.pages.forEach(element => {
          var arr = rolePages.filter(x => x.pageId === element.id && x.roleId === this.selectedRole);

          if (arr.length > 0) {
            element.rolePage = arr[0];
          } else {
            var rolePage = new RolePage();
            rolePage.id = 0;
            rolePage.pageId = element.id;
            rolePage.roleId = this.selectedRole;
            rolePage.isAccess = false;
            rolePage.isAdd = false;
            rolePage.isDelete = false;
            rolePage.isEdit = false;
            element.rolePage = rolePage;
          }

          element.children.forEach(child => {
            var arrChild = rolePages.filter(x => x.pageId === child.id && x.roleId === this.selectedRole);;

            if (arrChild.length > 0) {
              child.rolePage = arrChild[0];
            } else {
              var rolePage = new RolePage();
              rolePage.id = 0;
              rolePage.pageId = child.id;
              rolePage.roleId = this.selectedRole;
              rolePage.isAccess = false;
              rolePage.isAdd = false;
              rolePage.isDelete = false;
              rolePage.isEdit = false;
              child.rolePage = rolePage;
            }
          });
        });
      }
    );
  }

  saveChange() {
    if (!this.selectedModulePage) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn module" });
      return;
    }

    if (!this.selectedRole) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn chức vụ" });
      return;
    }

    var rolePages: RolePage[] = [];

    this.pages.forEach(element => {
      rolePages.push(element.rolePage);

      element.children.forEach(child => {
        child.rolePage.roleId = this.selectedRole;
        child.rolePage.pageId = child.id;
        rolePages.push(child.rolePage);
      });
    });

    this.permissionService.updatePermission(rolePages).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        var rolePages = x.data as RolePage[];
        this.pages.forEach(element => {
          element.rolePage = rolePages.filter(x => x.pageId === element.id && x.roleId === this.selectedRole)[0];

          element.children.forEach(child => {
            child.rolePage = rolePages.filter(x => x.pageId === child.id && x.roleId === this.selectedRole)[0];
          });

          this.messageService.add({ severity: Constant.messageStatus.success, detail: "Lưu thay đổi thành công" });
        });
      }
    );
  }
}
