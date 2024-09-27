import { Pipe, PipeTransform } from '@angular/core';
import { PatientStatus } from '../enums/patient-status.enum';

@Pipe({
  name: 'patientStatus',
})
export class PatientStatusPipe implements PipeTransform {

  private readonly enumLabels: { [key: string]: string } = {
    [PatientStatus.Inactivo]: 'Inactivo',
    [PatientStatus.Ambulatorio]: 'Ambulatorio',
    [PatientStatus.Hospitalizado]: 'Hospitalizado',
    [PatientStatus.Urgencias]: 'Urgencias',
    [PatientStatus.Quirofano]: 'Quirófano'
  }
  transform(value: PatientStatus): string {
    return this.enumLabels[value];
  }

}
