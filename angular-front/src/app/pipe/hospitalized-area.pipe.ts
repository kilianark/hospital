import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HospitalzedArea } from '../enums/hospitalized-area.enum';
@Pipe({
  name: 'hospitalizedArea',
  pure: false,
})
export class HospitalizedAreaPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: HospitalzedArea): string {
    try {
      let areaName = HospitalzedArea[value]; // Obtener el nombre de la propiedad del enum
      // Separar palabras por mayúsculas (camelCase)
      const separatedAreaName = areaName.replace(/([a-z])([A-Z])/g, '$1 $2');

      // Intentar traducir el nombre separado
      return this.translate.instant(`hospitalized_area.${value}`, {
        defaultValue: separatedAreaName,
      });
    } catch (ex) {
      console.error('Error transforming hospitalized area', ex);
      return ''; // En caso de error, retorna una cadena vacía
    }
  }
}
