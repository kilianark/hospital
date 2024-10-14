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
  static validDni(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dni = control.value;

      // Si el valor es nulo o vacío, no realizar ninguna validación
      if (!dni) return null;

      // Verificar que el DNI tiene la longitud correcta
      if (dni.length !== 9) {
        return { invalidDNI: true }; // Longitud no válida
      }

      // Separar números y letra
      const numbers = dni.slice(0, 8);
      const letter = dni.charAt(8).toUpperCase();

      // Comprobar que los primeros 8 caracteres son números
      if (!/^\d{8}$/.test(numbers)) {
        return { invalidDNI: true }; // Números no válidos
      }

      // Calcular la letra correspondiente
      const dniNumber = parseInt(numbers, 10);
      const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKET';
      const calculatedLetter = validLetters.charAt(dniNumber % 23);

      // Comparar la letra calculada con la letra del DNI
      return calculatedLetter === letter ? null : { invalidDNI: true }; // DNI válido o no
    };
  }

  // Validador que comprueba que el CIP sea valido
  static validCip(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cip = control.value;

      // Si el valor es nulo o vacío, no realizar ninguna validación
      if (!cip) return null;

      // Verificar que el CIP tiene la longitud correcta
      if (!cip || !/^[A-Z]{4} \d{8}$/.test(cip)) {
        return { invalidCIP: true }; // Formato no válido
      }

      // Hay que editar esto para que siga todos los requerimientos del nombre, apellido, genero etc

      return null; // CIP válido
    };
  }




}

