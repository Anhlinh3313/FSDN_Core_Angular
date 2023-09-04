import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { GeneralMenuRoutingModule } from './general-menu.routing';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeTableModule, DataTableModule, SharedModule, DropdownModule, CheckboxModule } from 'primeng/primeng';
//
import { CountryService,ProvinceService,DistrictService,WardService,RoleService,DepartmentService,UserService, PageService, ModulePageService } from '../../services';
//
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { FocusModule } from 'angular2-focus';
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
    GeneralMenuRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TreeTableModule,
    SharedModule,
    DataTableModule,
    DropdownModule,
    CheckboxModule,
    FocusModule.forRoot(),
    TableModule,
  ],
  declarations: [
    MenuManagementComponent,
  ],
  entryComponents: [
  ],
  providers: [
    CountryService,
    ProvinceService,
    DistrictService,
    WardService,
    RoleService,
    DepartmentService,
    UserService,
    ModulePageService,
    RoleService,
    PageService
  ]

})
export class GeneralMenuModule { }
