import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static dateRange(minDate: Date, maxDate: Date) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = new Date(control.value);
      if (isNaN(value.getTime())) {
        return null; // Return if value is not a valid date
      }

      if (value < minDate) {
        return { minDate: true };
      }

      if (value > maxDate) {
        return { maxDate: true };
      }

      return null; // No errors
    };
  }

  // Validador para no permitir solo espacios en blanco (si se usa, no puede ser en elemento required)
  static notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Ignora el control si es null o undefined
      if (control.value === null || control.value === undefined) {
        return null; // Permite que el validador.required maneje el caso de null
      }
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { notBlank: true };
    };
  }

  // Validador que comprueba que el dni sea valido
  static validDniOrNie(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Si el valor es nulo o vacío, no realizar ninguna validación
      if (!value) return null;

      // Llama a la función de validación combinada
      const isValid = validarDniNie(value);

      // Devuelve un error si no es válido
      return isValid ? null : { invalidDNI: true };
    };
  }

  // Validador que comprueba que el CIP sea valido
  static validCip(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cip = control.value;

      // Si el valor es nulo o vacío, no realizar ninguna validación
      if (!cip) return null;

      // Verificar que el CIP tiene la longitud correcta
      if (!cip || !/^[A-Z]{4} \d{10}$/.test(cip)) {
        return { invalidCIP: true }; // Formato no válido
      }

      // Hay que editar esto para que siga todos los requerimientos del nombre, apellido, genero etc

      return null; // CIP válido
    };
  }


}

// Función para validar DNI/NIE
function validarDniNie(value: string): boolean {
  const validChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const nifRegex = /^[0-9]{8}[A-Z]$/i; // Formato DNI
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i; // Formato NIE

  const str = value.toString().toUpperCase().trim();

  // Validación para DNI
  if (nifRegex.test(str)) {
    const numbers = str.slice(0, 8);
    const letter = str.charAt(8);
    const dniNumber = parseInt(numbers, 10);
    const calculatedLetter = validChars.charAt(dniNumber % 23);
    return calculatedLetter === letter;
  }
  // Validación para NIE
  else if (nieRegex.test(str)) {
    let nieNumber = str;

    if (nieNumber.charAt(0) === 'X') {
      nieNumber = '0' + nieNumber.substr(1);
    } else if (nieNumber.charAt(0) === 'Y') {
      nieNumber = '1' + nieNumber.substr(1);
    } else if (nieNumber.charAt(0) === 'Z') {
      nieNumber = '2' + nieNumber.substr(1);
    }

    const letter = str.charAt(8);
    const calculatedLetter = validChars.charAt(parseInt(nieNumber, 10) % 23);
    return calculatedLetter === letter;
  }

  return false; // Formato no válido
}
