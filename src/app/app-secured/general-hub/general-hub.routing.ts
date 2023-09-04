import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
//
import { HubCenterManagementComponent } from './hub-center-management/hub-center-management.component';
import { HubPoManagementComponent } from './hub-po-management/hub-po-management.component';
import { HubStationManagementComponent } from './hub-station-management/hub-station-management.component';
import { HubRouteManagementComponent } from './hub-route-management/hub-route-management.component';
import { HubRoutingManagementComponent } from './hub-routing-management/hub-routing-management.component';
import { AreaCManagementComponent } from './areac-management/areac-management.component';

const routes: Routes =  [
    { path: Constant.pages.generalHub.childrens.hubCenterManagement.alias, component: HubCenterManagementComponent },
    { path: Constant.pages.generalHub.childrens.hubPoManagement.alias, component: HubPoManagementComponent },
    { path: Constant.pages.generalHub.childrens.AreaCManagement.alias, component: AreaCManagementComponent },
    { path: Constant.pages.generalHub.childrens.hubStationManagement.alias, component: HubStationManagementComponent },
    { path: Constant.pages.generalHub.childrens.hubRouteManagement.alias, component: HubRouteManagementComponent },
    { path: Constant.pages.generalHub.childrens.hubRoutingManagement.alias, component: HubRoutingManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class GeneralHubRoutingModule { }
