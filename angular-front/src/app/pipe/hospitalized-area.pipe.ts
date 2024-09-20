import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HospitalizedArea } from '../enums/hospitalized-area.enum';
@Pipe({
  name: 'hospitalizedArea',
  pure: false,
})
export class HospitalizedAreaPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: HospitalizedArea) {
    try {
      switch (+value) {
        case HospitalizedArea.MedicinaInterna:
          return this.translate.instant('Medicina Interna');
      }
    } catch (ex) {
      return '';
    }
  }
}
