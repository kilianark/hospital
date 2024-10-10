import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  // Validador para no permitir solo espacios en blanco ( si se usa, no puede ser en elemento required )
  static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }
}