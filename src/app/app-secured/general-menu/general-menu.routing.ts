import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
import { MenuManagementComponent } from './menu-management/menu-management.component';
//


const routes: Routes =  [
  { path: Constant.pages.generalMenu.childrens.menu.alias, component: MenuManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class GeneralMenuRoutingModule { }
