import { Pipe, PipeTransform } from '@angular/core';
import { AmbulatoryArea } from '../enums/ambulatory-area.enum';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'ambulatoryAreaPipe',
  pure: false
})
export class AmbulatoryAreaPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: AmbulatoryArea) {
    try {
      switch(+value) {
        case AmbulatoryArea.ConsultaExterna:
          return this.translate.instant('t-consulta-externa');
        case AmbulatoryArea.HospitalDia:
          return this.translate.instant('t-hospital-dia');
        case AmbulatoryArea.SalaEspera:
          return this.translate.instant('t-sala-espera');
        default:
          return this.translate.instant('t-default');
      }
    } catch (ex) {
      return '';
    }
    // return null;
  }
}
