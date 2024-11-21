import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  status: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  appointment: Appointment = {
    id: 0,
    patientId: 1, // Ejemplo
    doctorId: 1,  // Ejemplo
    appointmentDate: new Date(),
    status: 'Pending'
  };
  appointmentId: number | null = null;

  private apiUrl = '/api/appointments'; // Cambiar por la URL real de la API

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar las citas al inicio
    this.loadAppointments();

    // Comprobar si es una edición de cita
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.appointmentId = +params['id'];
        this.loadAppointment(this.appointmentId);
      }
    });
  }

  // Cargar todas las citas
  loadAppointments(): void {
    this.http.get<Appointment[]>(this.apiUrl).subscribe((data) => {
      this.appointments = data;
    });
  }

  // Cargar una cita específica
  loadAppointment(id: number): void {
    this.http.get<Appointment>(`${this.apiUrl}/${id}`).subscribe((data) => {
      this.appointment = data;
    });
  }

  // Crear o actualizar una cita
  submitAppointment(): void {
    if (this.appointmentId) {
      // Actualizar cita
      this.http.put(`${this.apiUrl}/${this.appointment.id}`, this.appointment).subscribe(() => {
        this.router.navigate(['/appointments']);
      });
    } else {
      // Crear nueva cita
      this.http.post(this.apiUrl, this.appointment).subscribe(() => {
        this.router.navigate(['/appointments']);
      });
    }
  }

  // Cancelar cita
  cancelAppointment(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadAppointments(); // Recargar citas
    });
  }

  // Navegar a la página de creación de citas
  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }
}
