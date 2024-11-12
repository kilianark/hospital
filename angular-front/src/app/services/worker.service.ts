import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    switch (worker.worktype) {
      case 'nurse':
        return this.http.post<Worker>(`${this.apiUrl}/nurses`, worker).pipe(catchError(this.handleError));
      case 'doctor':
        return this.http.post<Worker>(`${this.apiUrl}/doctors`, worker).pipe(catchError(this.handleError));
      case 'administrator':
        return this.http.post<Worker>(`${this.apiUrl}/administrators`, worker).pipe(catchError(this.handleError));
      default:
        return throwError('Invalid worker type');
    }
  }

  // Obtener trabajadores de un tipo específico
  getWorkersByType(type: string): Observable<Worker[]> {
    switch (type) {
      case 'nurse':
        return this.http.get<Worker[]>(`${this.apiUrl}/nurses`).pipe(catchError(this.handleError));
      case 'doctor':
        return this.http.get<Worker[]>(`${this.apiUrl}/doctors`).pipe(catchError(this.handleError));
      case 'administrator':
        return this.http.get<Worker[]>(`${this.apiUrl}/administrators`).pipe(catchError(this.handleError));
      default:
        return throwError('Invalid worker type');
    }
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal, por favor intente de nuevo más tarde.');
  }
}
