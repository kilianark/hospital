import { Pipe, PipeTransform } from '@angular/core';
import { AmbulatoryArea } from '../enums/ambulatory-area.enum';
@Pipe({
  name: 'ambulatoryAreaPipe',
})
export class AmbulatoryAreaPipe implements PipeTransform {
  private readonly enumLabels: { [key: string]: string } = {
    [AmbulatoryArea.ConsultaExterna]: 'Consulta externa',
    [AmbulatoryArea.HospitalDia]: 'Hospital de día',
    [AmbulatoryArea.SalaEspera]: 'Sala de espera'
  }
  
  transform(value: AmbulatoryArea): string {
    return this.enumLabels[value];
  }
}
