import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Worker } from '../interfaces/worker.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = 'https://localhost:5124/api'; // URL base para la API

  constructor(private http: HttpClient) {}

  // Crear un nuevo trabajador según su tipo
  createWorker(worker: Worker): Observable<Worker> {
    const endpoint = this.getWorkerEndpoint(worker.worktype);
    if (!endpoint) return throwError(() => new Error('Invalid worker type'));

    // Asegúrate de que el worker tiene un id antes de enviarlo al servidor
    worker.id = worker.id || 0;  // Si no tiene id, se asigna un valor por defecto

    return this.http.post<Worker>(endpoint, worker).pipe(catchError(this.handleError));
  }

  // Verifica si el DNI ya existe en la base de datos, excluyendo un código de trabajador si es necesario
  checkDniExists(dni: string, excludePatientCode?: number): Observable<boolean> {
    const url = `${this.apiUrl}/check-dni`;  // Asegúrate de que esta URL esté correctamente apuntando al endpoint de trabajadores
    return this.http.get<Worker[]>(url, { params: { dni } }).pipe(
      map(workers => {
        if (excludePatientCode) {
          // Filtrar el trabajador actual si se proporciona un código
          workers = workers.filter(worker => worker.id !== excludePatientCode);
        }
        return workers.length > 0;  // Si queda algún trabajador con ese DNI, el DNI ya existe
      }),
      catchError(() => of(false))  // En caso de error, retornamos que no existe para no bloquear la validación
    );
  }

  // Obtener trabajadores de un tipo específico
  getWorkersByType(type: string): Observable<Worker[]> {
    const endpoint = this.getWorkerEndpoint(type);
    if (!endpoint) return throwError(() => new Error('Invalid worker type'));

    return this.http.get<Worker[]>(endpoint).pipe(catchError(this.handleError));
  }

  // Obtener el endpoint según el tipo de trabajador
  private getWorkerEndpoint(worktype: string): string | null {
    switch (worktype) {
      case 'nurse':
        return `${this.apiUrl}/nurses`;
      case 'doctor':
        return `${this.apiUrl}/doctors`;
      case 'administrator':
        return `${this.apiUrl}/administrators`;
      default:
        return null;
    }
  }

  // Actualizar un trabajador (con su id)
  updateWorker(worker: Worker): Observable<Worker> {
    const endpoint = `${this.getWorkerEndpoint(worker.worktype)}/${worker.id}`;
    if (!endpoint) return throwError(() => new Error('Invalid worker type'));

    return this.http.put<Worker>(endpoint, worker).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    let errorMessage = 'Algo salió mal, por favor intente de nuevo más tarde.';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o de red
      errorMessage = `Error de red o cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
