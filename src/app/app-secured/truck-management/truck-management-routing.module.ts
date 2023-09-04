import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
import { ListTruckComponent } from './list-truck/list-truck.component';
import { TruckTypeComponent } from './truck-type/truck-type.component';
import { TruckOwnershipComponent } from './truck-ownership/truck-ownership.component';
import { TruckRentalComponent } from './truck-rental/truck-rental.component';

const routes: Routes = [
  { path: Constant.pages.truckManagementModule.childrens.listTruck.alias, component: ListTruckComponent },
  { path: Constant.pages.truckManagementModule.childrens.truckType.alias, component: TruckTypeComponent },
  { path: Constant.pages.truckManagementModule.childrens.truckOwnership.alias, component: TruckOwnershipComponent },
  { path: Constant.pages.truckManagementModule.childrens.truckRental.alias, component: TruckRentalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TruckManagementRoutingModule { }
