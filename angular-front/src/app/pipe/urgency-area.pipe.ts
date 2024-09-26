import { Pipe, PipeTransform } from '@angular/core';
import { UrgencyArea } from '../enums/urgency-area.enum';

@Pipe({
  name: 'urgencyArea',
})
export class UrgencyAreaPipe implements PipeTransform {
  private readonly enumLabels: { [key: string]: string } = {
    [UrgencyArea.MedicinaInterna]: 'Sala de medicina interna',
    [UrgencyArea.AtencionPrimaria]: 'Sala de atención primaria',
    [UrgencyArea.BoxCritico]: 'Box crítico',
  };
  transform(value: UrgencyArea): string {
    return this.enumLabels[value];
  }
}
