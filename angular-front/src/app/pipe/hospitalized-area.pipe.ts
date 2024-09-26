import { Pipe, PipeTransform } from '@angular/core';
import { HospitalizedArea } from '../enums/hospitalized-area.enum';
@Pipe({
  name: 'hospitalizedArea',
})
export class HospitalizedAreaPipe implements PipeTransform {
  private readonly enumLabels: { [key: string]: string } = {
    [HospitalizedArea.MedicinaInterna]: 'Medicina interna',
  };
  transform(value: HospitalizedArea): string {
    return this.enumLabels[value];
  }
}
