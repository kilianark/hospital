import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap, first } from 'rxjs/operators';
import { PatientService } from '../services/patient.service';

export class AsyncValidators {

    // Comprueba que el dni no exista ya en la bd
    static checkDni(patientService: PatientService, patientCode?: number): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const dni = control.value;

            if (!dni) {
                return of(null);  // Si el campo DNI está vacío, no hacer la validación
            }

            return of(dni).pipe(
                debounceTime(300),  // Dar tiempo para evitar múltiples llamadas innecesarias
                switchMap(() => patientService.checkDniExists(dni, patientCode)),  // Llamar al servicio pasando el DNI y el patientCode
                map(dniExists => dniExists ? { dniExists: true } : null),  // Si el DNI existe pero es de otro paciente, mostrar el error
                catchError(() => of(null))  // En caso de error, considerar que la validación pasó
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