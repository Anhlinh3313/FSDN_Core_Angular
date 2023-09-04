import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../shared/guard/auth.guard';
import { Constant } from '../infrastructure/constant';

//Component
import { AppSecuredComponent } from './app-secured.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { ChangePassWordComponent } from './change-password/change-password.component';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';

const appRoutes: Routes = [
  { path: '', component: AppSecuredComponent, canActivate: [AuthGuard],  canActivateChild: [AuthGuard], children: [
      { path: '', component: WelcomeComponent },
      { path: Constant.pages.changePassWord.alias, component: ChangePassWordComponent },
      {
        path: Constant.pages.general.alias, loadChildren: Constant.pages.general.loadChildren
      },
      {
        path: Constant.pages.generalSystem.alias, loadChildren: Constant.pages.generalSystem.loadChildren
      },
      {
        path: Constant.pages.generalLocation.alias, loadChildren: Constant.pages.generalLocation.loadChildren
      },
      {
        path: Constant.pages.generalHub.alias, loadChildren: Constant.pages.generalHub.loadChildren
      },
      {
        path: Constant.pages.generalMenu.alias, loadChildren: Constant.pages.generalMenu.loadChildren
      },
      {
        path: Constant.pages.truckManagementModule.alias, loadChildren: Constant.pages.truckManagementModule.loadChildren
      },
      {
        path: Constant.pages.recycleBin.alias, component: RecycleBinComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [ RouterModule ],
  declarations: [],
})
export class AppSecuredRoutingModule { }
