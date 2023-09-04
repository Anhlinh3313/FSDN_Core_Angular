import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
import { PermissionComponent } from './permission-management/permission.component';
//


const routes: Routes =  [
  { path: Constant.pages.generalSystem.childrens.permission.alias, component: PermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class GeneralSystemRoutingModule { }
