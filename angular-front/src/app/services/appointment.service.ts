import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppointmentInterface } from '../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl = 'http://localhost:5124/api/appointments';
  private appointmentUpdated = new Subject<AppointmentInterface>();

  constructor(private http: HttpClient) {}

  // Observable para emitir cambios en las citas
  get appointmentUpdated$(): Observable<AppointmentInterface> {
    return this.appointmentUpdated.asObservable();
  }

  // Obtener todas las citas
  getAppointmentData(doctorId?: number): Observable<AppointmentInterface[]> {
    let params = new HttpParams();
    
    if(doctorId != null && doctorId != undefined && doctorId != 0) {
      params = params.set('doctorId', doctorId);
    }

    return this.http.get<AppointmentInterface[]>(this.baseUrl, { params });
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
