import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
import { environment } from '../../environments/environment';

@Pipe({
  name: 'dateFormatNoTime'
})
export class DateFormatNoTimePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      let date = moment(value).format(environment.formatDate)
      return date;
    }
    return null;
  }

}
