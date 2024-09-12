import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusType',
  standalone: true
})
export class StatusTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
