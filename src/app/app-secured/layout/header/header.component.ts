import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { PageService, PermissionService } from '../../../services';
import { Page } from '../../../models';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styles: []
})

export class HeaderComponent  extends BaseComponent implements OnInit {

  userFullName: string = "";
  phoneModal: BsModalRef;
  constructor(
    private authService : AuthService, 
    private modalService: BsModalService,
    private pageService: PageService,
    public permissionService: PermissionService,
    public router: Router,
    protected messageService: MessageService,
  ) {
    super(messageService, permissionService, router);
   }
  
  ngOnInit() {
    this.userFullName = this.authService.getFullName();
  }

  public phoneNumber: string;

  public logOut() {
    this.authService.logout();
  }
}
