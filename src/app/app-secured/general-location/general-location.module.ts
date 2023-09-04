import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { GeneralLocationRoutingModule } from './general-location.routing';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeTableModule, DropdownModule,DataTableModule, CheckboxModule } from 'primeng/primeng';
//
import { CountryService, ProvinceService, DistrictService, WardService } from '../../services';
//
import { CountryManagementComponent } from './country-management/country-management.component';
import { ProvinceManagementComponent } from './province-management/province-management.component';
import { DistrictManagementComponent } from './district-management/district-management.component';
import { WardManagementComponent } from './ward-management/ward-management.component';
import { FocusModule } from 'angular2-focus';
import { SharedModule } from '../../shared/shared.module';
import { StreetManagementComponent } from './street-management/street-management.component';
import { StreetJoinService } from '../../services/streetJoin.service';
import { GeocodingApiService } from '../../services/geocodingApiService.service';
import { StreetService } from '../../services/street.service';
import { TableModule } from 'primeng/table';

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
    ReactiveFormsModule,
    GeneralLocationRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TreeTableModule,
    SharedModule,
    DataTableModule,
    DropdownModule,
    FocusModule.forRoot(),
    TableModule,
    CheckboxModule
  ],
  declarations: [
    CountryManagementComponent,
    ProvinceManagementComponent,
    DistrictManagementComponent,
    WardManagementComponent,
    StreetManagementComponent,
  ],
  entryComponents: [

  ],
  providers: [
    CountryService,
    ProvinceService,
    DistrictService,
    WardService,
    StreetJoinService,
    StreetService,
    GeocodingApiService,
  ]

})
export class GeneralLocationModule { }
