import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleplaceDirective } from './directives/google-place.directive';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      //flashship
      // apiKey: "AIzaSyDvWH7xuK-S8BhTKBYd61E2RsCvyyxHkSs",
      //vietstart
      apiKey: environment.gMapKey,
      libraries: ["places"],
      language: 'vi',
      region: 'VN'
    }),
    CommonModule,
    FormsModule
  ],
  declarations: [
    GoogleplaceDirective,
  ],
  exports: [
    GoogleplaceDirective,
  ],
  providers: []
})
export class SharedModule { }
