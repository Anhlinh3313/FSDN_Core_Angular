import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
//
import { CountryManagementComponent } from './country-management/country-management.component';
import { ProvinceManagementComponent } from './province-management/province-management.component';
import { DistrictManagementComponent } from './district-management/district-management.component';
import { WardManagementComponent } from './ward-management/ward-management.component';
import { StreetManagementComponent } from './street-management/street-management.component';

const routes: Routes =  [
    { path: Constant.pages.generalLocation.childrens.countryManagement.alias, component: CountryManagementComponent },
    { path: Constant.pages.generalLocation.childrens.provinceManagement.alias, component: ProvinceManagementComponent },
    { path: Constant.pages.generalLocation.childrens.districtManagement.alias, component: DistrictManagementComponent },
    { path: Constant.pages.generalLocation.childrens.wardManagement.alias, component: WardManagementComponent },
    { path: Constant.pages.generalLocation.childrens.streetManagement.alias, component: StreetManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class GeneralLocationRoutingModule { }
