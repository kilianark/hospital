import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppointmentInterface } from '../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl = 'https://api.tuhospital.com/appointments'; // Cambia esto por la URL de tu API
  private appointmentUpdated = new Subject<AppointmentInterface>();

  constructor(private http: HttpClient) {}

  // Observable para emitir cambios en las citas
  get appointmentUpdated$(): Observable<AppointmentInterface> {
    return this.appointmentUpdated.asObservable();
  }

  // Obtener todas las citas
  getAppointmentData(): Observable<AppointmentInterface[]> {
    return this.http.get<AppointmentInterface[]>(`${this.baseUrl}`);
  }

  // Obtener una cita por ID
  getAppointmentById(id: number): Observable<AppointmentInterface> {
    return this.http.get<AppointmentInterface>(`${this.baseUrl}/${id}`);
  }

  // Crear una nueva cita
  createAppointment(appointment: AppointmentInterface): Observable<AppointmentInterface> {
    return this.http.post<AppointmentInterface>(`${this.baseUrl}`, appointment);
  }

  // Actualizar una cita existente
  updateAppointment(id: number, appointment: AppointmentInterface): Observable<AppointmentInterface> {
    return this.http.put<AppointmentInterface>(`${this.baseUrl}/${id}`, appointment);
  }

  // Eliminar una cita
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Emitir un cambio en la cita para que otros componentes puedan reaccionar
  notifyAppointmentUpdated(appointment: AppointmentInterface): void {
    this.appointmentUpdated.next(appointment);
  }
}
