import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
//
import { RoleManagementComponent } from './role-management/role-management.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes =  [
    { path: Constant.pages.general.childrens.roleManagement.alias, component: RoleManagementComponent },
    { path: Constant.pages.general.childrens.departmentManagement.alias, component: DepartmentManagementComponent },
    { path: Constant.pages.general.childrens.userManagement.alias, component: UserManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class GeneralRoutingModule { }
