import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formattedIsoDate'
})
export class FormattedIsoDatePipe implements PipeTransform {

  transform(value: string): unknown {
    return moment(value).format("DD-MM-YYYY hh:mm A");
  }

}
