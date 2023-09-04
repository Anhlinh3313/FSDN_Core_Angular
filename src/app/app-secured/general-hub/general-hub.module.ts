import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { GeneralHubRoutingModule } from './general-hub.routing';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeTableModule, DataTableModule, DropdownModule, CheckboxModule } from 'primeng/primeng';
//
import { CountryService, ProvinceService, DistrictService, WardService, HubService, HubRouteService, HubRoutingService, UserService, AreaCService } from '../../services';
//
import { HubCenterManagementComponent } from './hub-center-management/hub-center-management.component';
import { HubPoManagementComponent } from './hub-po-management/hub-po-management.component';
import { HubStationManagementComponent } from './hub-station-management/hub-station-management.component';
import { HubRouteManagementComponent } from './hub-route-management/hub-route-management.component';
import { HubRoutingManagementComponent } from './hub-routing-management/hub-routing-management.component';
import { FocusModule } from 'angular2-focus';
import { SharedModule } from '../../shared/shared.module';
import { GeocodingApiService } from '../../services/geocodingApiService.service';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AreaCManagementComponent } from './areac-management/areac-management.component';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GeneralHubRoutingModule,
    ModalModule.forRoot(),
    // TooltipModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TreeTableModule,
    SharedModule,
    DataTableModule,
    DropdownModule,
    FocusModule.forRoot(),
    CheckboxModule,
    TableModule,
    TooltipModule
  ],
  declarations: [
    HubCenterManagementComponent,
    HubPoManagementComponent,
    HubStationManagementComponent,
    HubRouteManagementComponent,
    HubRoutingManagementComponent,
    AreaCManagementComponent
  ],
  entryComponents: [
  ],
  providers: [
    CountryService,
    ProvinceService,
    DistrictService,
    WardService,
    HubService,
    HubRouteService,
    HubRoutingService,
    UserService,
    GeocodingApiService,
    AreaCService
  ],
})
export class GeneralHubModule { }
