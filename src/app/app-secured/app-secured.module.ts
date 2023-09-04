import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from './layout/layout.module';
import { AppSecuredRoutingModule } from './app-secured-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleTimer } from 'ng2-simple-timer';
import { AutoCompleteModule, DataTableModule, RadioButtonModule, TreeTableModule, DropdownModule, MultiSelectModule, CalendarModule, CheckboxModule } from 'primeng/primeng';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//
import { AppSecuredComponent } from './app-secured.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from '../services/index';
import { ChangePassWordComponent } from './change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';
import { TableModule } from 'primeng/table';
import { RecycleBinService } from '../services/recycle-bin.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DateFormatNoTimePipe } from '../pipes/dateFormatNoTime.pipes';
import { DateFormatPipe } from '../pipes/dateFormat.pipe';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      //flashship
      // apiKey: "AIzaSyDvWH7xuK-S8BhTKBYd61E2RsCvyyxHkSs",
      //vietstart
      apiKey: "AIzaSyBwjHPz6q5c0lNukX_9q_UXD3SiviB8cOU",
      libraries: ["places"],
    }),
    CommonModule,
    AppSecuredRoutingModule,
    LayoutModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    SharedModule,
    AutoCompleteModule,
    DataTableModule,
    RadioButtonModule,
    TreeTableModule,
    DropdownModule, 
    MultiSelectModule, 
    CalendarModule, 
    CheckboxModule,
    NgxDatatableModule,
    TableModule,
    Daterangepicker

  ],
  declarations: [
    AppSecuredComponent, 
    WelcomeComponent,
    ChangePassWordComponent,
    RecycleBinComponent,
    DateFormatNoTimePipe,
    DateFormatPipe,
  ],
  providers: [
    SimpleTimer,
    UserService,
    RecycleBinService,
  ],
  entryComponents: [],
  exports: []
})
export class AppSecuredModule { }
