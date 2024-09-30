import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {

  transform(value: number, enumType: any): string {
    return enumType[value].replace(/([a-z])([A-Z])/g, '$1 $2').replace(/( [A-Z])/g, ' $1');
  }

}
