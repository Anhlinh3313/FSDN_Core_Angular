import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { environment } from '../../environments/environment';
import { Constant } from '../infrastructure/constant';

@Component({
  selector: 'app-404',
  templateUrl: '404.component.html',
  styles: []
})
export class Page404Component implements OnInit {

  constructor(private authService : AuthService, private messageService: MessageService) { }

  currentPage: string = Constant.pages.page404.name;

  ngOnInit() {
  }
}
