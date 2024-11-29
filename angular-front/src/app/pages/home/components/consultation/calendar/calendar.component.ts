import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { WorkerComponent } from '../../worker/worker.component';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AppointmentService } from '../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../interfaces/appointment.interface';
import { PatientComponent } from '../../patient/patient.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  title = "Calendario";
  events = []; // To hold processed calendar events
  appointments: { date: Date; patientId: number }[] = [];
  patients: { nombre: string; apellido: string; patientId: number }[] = [];
  doctorID!: number; // Ensure it's properly typed
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [] // Initially empty
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private readonly keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    // Load user profile and doctor ID
    this.keycloak.loadUserProfile().then((profile) => {
      this.doctorID = profile.attributes['doctorID'][0];

      // Fetch appointment and patient data after doctorID is available
      this.appointmentService.getAppointmentData().subscribe((appointmentData) => {
        this.appointments = appointmentData.map((appointment) => ({
          date: new Date(appointment.appointmentDate), // Ensure date is a Date object
          patientId: appointment.patientId,
        }));

        this.patientService.getPatientData().subscribe((patientData) => {
          this.patients = patientData.map((patient) => ({
            nombre: patient.name,
            apellido: patient.surname1,
            patientId: patient.id
            , // Assuming patientId exists for mapping
          }));

          // Populate calendar events after both datasets are loaded
          this.populateCalendarEvents();
        });
      });
    });
  }

  private populateCalendarEvents(): void {
    this.calendarOptions.events = this.appointments
      .filter((appointment) => appointment.patientId === this.doctorID) // Match appointments with doctorID
      .map((appointment) => {
        // Find the corresponding patient
        const patient = this.patients.find((p) => p.patientId === appointment.patientId);

        return {
          title: patient
            ? `${patient.nombre} ${patient.apellido}` // Use patient name if found
            : 'Unknown Patient',
          start: appointment.date, // Ensure proper date format
        };
      });
  }
}