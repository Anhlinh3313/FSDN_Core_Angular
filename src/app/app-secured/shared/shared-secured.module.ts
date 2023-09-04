import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';
import { Http } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule
  ],
  declarations: [],
  providers: [],
  exports: [],
  entryComponents: []
})
export class SharedSecuredModule { }
