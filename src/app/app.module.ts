import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { PersistenceModule } from 'angular-persistence';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Google Place Module
import { ApiEndpointInterceptor } from './http-interceptor/api-endpoint.interceptor';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './shared/guard/auth.guard';

import { GrowlModule } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Http, HttpModule } from '@angular/http';
import { Page403Component } from './403/403.component';
import { Page404Component } from './404/404.component';
import { PermissionService } from './services';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { UserService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Page403Component,
    Page404Component,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    PersistenceModule,
    GrowlModule,
    NgProgressModule,
    ModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiEndpointInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    AuthService,
    AuthGuard,
    MessageService,
    PermissionService,
    BsModalService,
    UserService
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
