import { Pipe, PipeTransform } from '@angular/core';
import { OperatingRoomArea } from '../enums/operatingRoom-area.enum';

@Pipe({
  name: 'operatingRoomArea'
})
export class OperatingRoomAreaPipe implements PipeTransform {

  private readonly enumLabels: { [key: string]: string } = {
    [OperatingRoomArea.SalaOperacion]: 'Sala de operación',
    [OperatingRoomArea.SalaReanimacion]: 'Sala de eanimación',
    [OperatingRoomArea.SalaEspera]: 'Sala de espera'
  }
  transform(value: OperatingRoomArea): string {
    return this.enumLabels[value];
  }

}
