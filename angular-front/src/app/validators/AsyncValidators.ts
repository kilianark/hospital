import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';
import { PatientService } from '../services/patient.service';

export class AsyncValidators {

    // Comprueba que el dni no exista ya en la bd
    static checkDni(patientService: PatientService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.value ? patientService.checkDniExists(control.value).pipe(
                map((dniExists: boolean) => (dniExists ? { dniExists: true } : null)),
                catchError(() => of(null)) // Maneja el error como un caso válido si la llamada falla
            ) : of(null);
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