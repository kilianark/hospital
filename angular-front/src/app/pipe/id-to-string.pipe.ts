import { Pipe, PipeTransform } from '@angular/core';
import { DoctorInterface } from '../interfaces/doctor.interface';
import { PatientInterface } from '../interfaces/patient.interface';

@Pipe({
  name: 'idToString',
})
export class IdToStringPipe implements PipeTransform {

  transform(value: number, data: DoctorInterface[] | PatientInterface[]): string {
    var fullName = data.find(item => item.id == value ).name + " " + data.find(item => item.id == value ).surname1
    return fullName;
  }

}
