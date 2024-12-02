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
import { DoctorService } from '../../../../../services/doctor.service';
import { DoctorInterface } from '../../../../../interfaces/doctor.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  title = "Calendario";
  events = []; // To hold processed calendar events
  appointments: { date: Date; patientId: number; doctorId: number }[] = [];
  patients: { nombre: string; apellido: string; patientId: number }[] = [];
  workerCode!: number; // Ensure it's properly typed
  doctorId!: number; // Ensure it's properly typed
  AdoctorId!: number; // Ensure it's properly typed
  private doctor: DoctorInterface;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [] // Initially empty
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private readonly keycloak: KeycloakService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load user profile and doctor ID
    this.keycloak.loadUserProfile().then((profile) => {
      this.workerCode = profile.attributes['workerCode'][0];
      console.log(this.workerCode);
      this.doctorService.getDoctorData(this.workerCode).subscribe((data) => {
        if(data.length > 0) this.doctor = data[0];
        this.AdoctorId = this.doctor.id;
        console.log(this.AdoctorId);
      });
    });
      // Fetch appointment and patient data after doctorID is available
      this.appointmentService.getAppointmentData(this.workerCode).subscribe((appointmentData) => {
        console.log(appointmentData)
        this.appointments = appointmentData.map((appointment) => ({
          date: new Date(appointment.appointmentDate), // Ensure date is a Date object
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        }));
        
      });
        this.patientService.getPatientData().subscribe((patientData) => {
          this.patients = patientData.map((patient) => ({
            nombre: patient.name,
            apellido: patient.surname1,
            patientId: patient.id
            , // Assuming patientId exists for mapping
          }));
          
          console.log(this.patients)
          // Populate calendar events after both datasets are loaded
          this.populateCalendarEvents();
        });
  }

  private populateCalendarEvents(): void {
    console.log(this.appointments)
    this.calendarOptions.events = this.appointments.filter((appointment) => appointment.doctorId === this.AdoctorId).map((appointment) => {
        // Find the corresponding patient
        const patient = this.patients.find((patient) => patient.patientId === appointment.patientId);
        console.log(patient)
        return {  
          title: patient
            ? `${patient.nombre} ${patient.apellido}` // Use patient name if found
            : 'Unknown Patient',
          start: appointment.date, // Ensure proper date format
        };
      });
  }
  goToManage(id: number) {
    this.router.navigate(['/manage', id]);
  }
}