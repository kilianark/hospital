import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Worker } from '../interfaces/worker.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = 'https://localhost:5124/api';

  constructor(private http: HttpClient) {}

  // Crear un nuevo trabajador según su tipo
  createWorker(worker: Worker): Observable<Worker> {
    const endpoint = this.getWorkerEndpoint(worker.worktype);
    if (!endpoint) return throwError(() => new Error('Invalid worker type'));

    return this.http.post<Worker>(endpoint, worker).pipe(catchError(this.handleError));
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
