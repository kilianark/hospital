import { Pipe, PipeTransform } from '@angular/core';
import { UrgencyArea } from '../enums/urgency-area.enum';

@Pipe({
  name: 'urgencyArea',
})
export class UrgencyAreaPipe implements PipeTransform {
  private readonly enumLabels: { [key: string]: string } = {
    [UrgencyArea.Box]: 'Box',
    [UrgencyArea.BoxCritico]: 'Box crítico',
    [UrgencyArea.MedicinaInterna]: 'Medicina interna',
    [UrgencyArea.AtencionPrimaria]: 'Atención primaria',
    [UrgencyArea.Triaje]: 'Triaje',
  };
  transform(value: UrgencyArea): string {
    return this.enumLabels[value];
  }
}
