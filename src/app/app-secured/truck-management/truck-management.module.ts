import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTruckComponent } from './list-truck/list-truck.component';
import { TruckTypeComponent } from './truck-type/truck-type.component';
import { TruckOwnershipComponent } from './truck-ownership/truck-ownership.component';
import { TruckRentalComponent } from './truck-rental/truck-rental.component';
import { TruckManagementRoutingModule } from './truck-management-routing.module';
import { TableModule } from 'primeng/table';
import { TruckOwnershipService } from '../../services/truck-ownership.service';
import { TruckRentalService } from '../../services/truck-rental.service';
import { TruckService } from '../../services/truck.service';
import { TruckTypeService } from '../../services/truck-type.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { GeocodingApiService } from '../../services/geocodingApiService.service';
import { DropdownModule } from 'primeng/primeng';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TruckManagementRoutingModule,
    TableModule,
    SharedModule,
    DropdownModule,
  ],
  declarations: [
    ListTruckComponent,
    TruckTypeComponent,
    TruckOwnershipComponent,
    TruckRentalComponent
  ],
  providers: [
    TruckOwnershipService,
    TruckRentalService,
    TruckService,
    TruckTypeService,
    GeocodingApiService
  ]
})
export class TruckManagementModule { }
