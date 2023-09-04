import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
import { environment } from '../../environments/environment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      let date = moment(value).format(environment.formatDateTime)
      return date;
    }
    return null;
  }

}
