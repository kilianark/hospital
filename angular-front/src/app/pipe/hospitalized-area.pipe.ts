import { Pipe, PipeTransform } from '@angular/core';
import { HospitalizedArea } from '../enums/hospitalized-area.enum';
@Pipe({
  name: 'hospitalizedArea',
})
export class HospitalizedAreaPipe implements PipeTransform {
  private readonly enumLabels: { [key: string]: string } = {
    [HospitalizedArea.UCI]: 'Unidad de cuidados intensivos',
    [HospitalizedArea.MedicinaInterna]: 'Medicina interna',
    [HospitalizedArea.Pediatria]: 'Pediatría',
    [HospitalizedArea.Ginecologia]: 'Ginecología',
    [HospitalizedArea.Oncologia]: 'Oncología',
    [HospitalizedArea.Psiquiatria]: 'Psiquiatría',
    [HospitalizedArea.Cirurgia]: 'Cirurgía',
  };
  transform(value: HospitalizedArea): string {
    return this.enumLabels[value];
  }
}
