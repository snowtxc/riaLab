import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeText'
})
export class ActiveTextPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? "SI": "NO";
   }

}
