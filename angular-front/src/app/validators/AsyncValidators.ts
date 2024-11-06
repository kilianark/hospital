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
    static checkCip(patientService: PatientService, patientCode: number): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const cip = control.value;
            if (!cip) {
                return of(null);  // Si el campo DNI está vacío, no hacer la validación
            }

            return of(cip).pipe(
                debounceTime(300),  // Dar tiempo para evitar múltiples llamadas innecesarias
                switchMap(() => patientService.checkCipExists(cip, patientCode)),  // Llamar al servicio pasando el DNI y el patientCode
                map(cipExists => cipExists ? { cipExists: true } : null),  // Si el DNI existe pero es de otro paciente, mostrar el error
                catchError(() => of(null))  // En caso de error, considerar que la validación pasó
            );
        };
    }




}