import { Pipe, PipeTransform } from '@angular/core';
import { AmbulatoryArea } from '../enums/ambulatory-area.enum';
import { TranslateService } from '../@ngx-translate/core';

@Pipe({
  name: 'ambulatoryArea',
  pure: false,
  standalone: true
})
export class AmbulatoryAreaPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: AmbulatoryArea) {
    try {
      switch(+value) {
        case AmbulatoryArea.ConsultaExterna:
          return this.translate.instant('Consulta Externa');
        case AmbulatoryArea.HospitalDia:
          return this.translate.instant('Hospital de dia');
        case AmbulatoryArea.SalaEspera:
          return this.translate.
      }
    } catch (ex) {
      return '';
    }
    // return null;
  }
}
