import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: number,  enumName: string): string {
    const enumKey = `${enumName}.${value}`;

    return this.translate.instant(enumKey);
  }

}
