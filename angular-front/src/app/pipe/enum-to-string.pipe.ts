import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString',
  standalone: true
})
export class EnumToStringPipe implements PipeTransform {

  transform(value: number, enumType: any): string {
    return enumType[value];
  }

}
