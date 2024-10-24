import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { PatientService } from '../services/patient.service';

export class AsyncValidators {

    // Comprueba que el dni no exista ya en la bd
    static checkDni(patientService: PatientService, currentDni?: string) {
        return (control: AbstractControl) => {
            const dni = control.value;

            // Si el DNI es el mismo que el actual, no hacemos la validación
            if (currentDni && dni === currentDni) {
                return of(null);  // Validación pasa
            }

            // Aquí sigue la validación para otros DNIs
            return patientService.checkDniExists(dni).pipe(
                map(dniExists => dniExists ? { dniExists: true } : null),
                catchError(() => of(null))
            );
        };
    }

    // Comprueba que el cip no exista ya en la bd
    static checkCip(patientService: PatientService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.value ? patientService.checkCipExists(control.value).pipe(
                map((CipExists: boolean) => (CipExists ? { CipExists: true } : null)),
                catchError(() => of(null))
            ) : of(null);
        }
    }




}