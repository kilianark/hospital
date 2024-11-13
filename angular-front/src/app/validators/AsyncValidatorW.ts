import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap, first } from 'rxjs/operators';
import { WorkerService } from '../services/worker.service';

export class AsyncValidatorsW {

    // Comprueba que el dni no exista ya en la bd
    static checkDni(workerService: WorkerService, id?: number): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const dni = control.value;
            if (!dni) {
                return of(null);
            }

            return of(dni).pipe(
                debounceTime(300),  // Dar tiempo para evitar múltiples llamadas innecesarias
                switchMap(() => workerService.checkDniExists(dni, id)),  // Llamar al servicio pasando el DNI y el patientCode
                map(dniExists => dniExists ? { dniExists: true } : null),  // Si el DNI existe pero es de otro paciente, mostrar el error
                catchError(() => of(null))  // En caso de error, considerar que la validación pasó
            );
        };
    }

  }
