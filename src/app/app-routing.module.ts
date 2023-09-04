import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component'

import { AuthGuard } from './shared/guard/auth.guard';

import { Constant } from './infrastructure/constant';
import { Page403Component } from './403/403.component';
import { Page404Component } from './404/404.component';

const appRoutes: Routes = [
  { path: '', loadChildren: './app-secured/app-secured.module#AppSecuredModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: Constant.pages.login.alias, component: LoginComponent },
  { path: Constant.pages.page403.alias, component: Page403Component },
  { path: Constant.pages.page404.alias, component: Page404Component },
  { path: '**', redirectTo: Constant.pages.page404.alias }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
