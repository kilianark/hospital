import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { diagnosticTests } from '../store/diagnostic-test.store';
import { specialities } from '../store/specialities.store';
import { WorkerService } from './worker.service';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticTestService {
  constructor(private workerService: WorkerService) {}

  getAvailableDiagnosticTests(): Observable<any[]> {
    return this.workerService.getWorkerData().pipe(
      map(workers => {
        const availableSpecialties = new Set(
          workers
            .filter(w => w.worktype === 'doctor' || w.worktype === 'nurse')
            .map(w => w.speciality)
        );

        const availableTests = [];
        specialities.forEach(speciality => {
          if (availableSpecialties.has(speciality.name) &&
              (speciality.workerType === 'doctor' || speciality.workerType === 'nurse')) {
            speciality.applicableTests.forEach(test => {
              const workerIds = workers
                .filter(w => w.speciality === speciality.name && (w.worktype === 'doctor' || w.worktype === 'nurse'))
                .map(w => w.id);
              availableTests.push({ test, workerIds });
            });
          }
        });

        return diagnosticTests.filter(test =>
          availableTests.some(at => at.test === test.code)
        ).map(test => {
          const testInfo = availableTests.find(at => at.test === test.code);
          return { ...test, workerIds: testInfo ? testInfo.workerIds : [] };
        });
      })
    );
  }


  getTestsBySpecialty(speciality: string): string[] {
    const specialityInfo = specialities.find(s => s.name === speciality && (s.workerType === 'doctor'||s.workerType === 'nurse'));
    return specialityInfo ? specialityInfo.applicableTests : [];
  }
  getWorkersByTestCode(testCode: string): Observable<any[]> {
    return this.workerService.getWorkerData().pipe(
      map(workers => {
        // Encontrar la especialidad asociada al código de prueba
        const speciality = specialities.find(s =>
          s.applicableTests.includes(testCode) &&
          (s.workerType === 'doctor' || s.workerType === 'nurse')
        )?.name;

        if (!speciality) {
          return []; // Retornar una lista vacía si no se encuentra la especialidad
        }

        // Filtrar y retornar los trabajadores completos por la especialidad
        return workers.filter(w =>
          w.speciality === speciality &&
          (w.worktype === 'doctor' || w.worktype === 'nurse')
        );
      })
    );
  }


}
