import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HospitalzedArea } from '../enums/hospitalized-area.enum';
@Pipe({
  name: 'hospitalizedArea',
  pure: false,
})
export class HospitalizedAreaPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: HospitalzedArea) {
    try {
      switch (+value) {
        case HospitalzedArea.MedicinaInterna:
          return this.translate.instant('Medicina Interna');
      }
    } catch (ex) {
      return '';
    }
  }
}
