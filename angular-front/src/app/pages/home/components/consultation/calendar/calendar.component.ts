import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { WorkerComponent } from '../../worker/worker.component';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { AppointmentService } from '../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../interfaces/appointment.interface';
import { PatientComponent } from '../../patient/patient.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { DoctorService } from '../../../../../services/doctor.service';
import { DoctorInterface } from '../../../../../interfaces/doctor.interface';
import { Router } from '@angular/router';
import { EditCalendarComponent } from '../../../../../components/editcalendar/edit-calendar/edit-calendar.component';
import esLocale from '@fullcalendar/core/locales/es';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  title = "Calendario";
  events = []; // To hold processed calendar events
  appointments: { date: Date; patientId: number; doctorId: number; id: number; inUrgencies: boolean }[] = [];
  patients: { nombre: string; apellido: string; patientId: number }[] = [];
  workerCode!: number; // Ensure it's properly typed
  appointmentID!: number; // Ensure it's properly typed
  AdoctorId!: number; // Ensure it's properly typed
  private doctor: DoctorInterface;
  calendarOptions: CalendarOptions = {
  
    locale: esLocale,
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    firstDay: 1,
    weekends: true,
    headerToolbar: {
      
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
      
    }, 
    events: [] // Initially empty
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private readonly keycloak: KeycloakService,
    private doctorService: DoctorService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Step 1: Load the user profile and doctor data
    this.keycloak.loadUserProfile().then((profile) => {
      this.workerCode = profile.attributes['workerCode'][0];
      console.log(this.workerCode);
  
      this.doctorService.getDoctorData(this.workerCode).subscribe((doctorData) => {
        if (doctorData.length > 0) {
          this.doctor = doctorData[0];
          this.AdoctorId = this.doctor.id;
          console.log(this.AdoctorId);
  
          // Step 2: Fetch appointment and patient data after doctor data is loaded
          Promise.all([
            this.appointmentService.getAppointmentData(this.AdoctorId).toPromise(),
            this.patientService.getPatientData().toPromise(),
          ]).then(([appointmentData, patientData]) => {
            console.log(appointmentData);
            // Map appointments
            this.appointments = appointmentData.map((appointment) => ({
              date: new Date(appointment.appointmentDate),
              patientId: appointment.patientId,
              doctorId: appointment.doctorId,
              id: appointment.id,
              inUrgencies: appointment.inUrgencies
            }));
            // Map patients
            this.patients = patientData.map((patient) => ({
              nombre: patient.name,
              apellido: patient.surname1,
              patientId: patient.id,
            }));
  
            console.log(this.patients);
            console.log(this.appointments);
  
            // Step 3: Populate calendar events
            this.populateCalendarEvents();
          }).catch((error) => {
            console.error("Error loading data:", error);
          });
        }
      });
    });
    
  }
  private populateCalendarEvents(): void {
    if (this.appointments.length === 0 || this.patients.length === 0) {
      console.warn("Data not fully loaded yet.");
      return;
    }
  
    this.calendarOptions.events = this.appointments
      .filter((appointment) => appointment.doctorId === this.AdoctorId)
      .map((appointment) => {
        // Find the corresponding patient
        const patient = this.patients.find((p) => p.patientId === appointment.patientId);
        if(appointment.inUrgencies){
          return {
            title: patient
              ? `${patient.nombre} ${patient.apellido}` // Use patient name if found
              : "Unknown Patient",
            start: appointment.date, // Ensure proper date format
            id: appointment.id.toString(), // Include the appointment ID
            backgroundColor: '#ff0000',
          };
        }
        return {
          title: patient
            ? `${patient.nombre} ${patient.apellido}` // Use patient name if found
            : "Unknown Patient",
          start: appointment.date, // Ensure proper date format
          id: appointment.id.toString(), // Include the appointment ID
        };
      });
  }
  openDialog(appointID: number) {
    let popupRef = this.dialog.open(EditCalendarComponent, {
      width: '80%',
      height: '80%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: appointID
    });
    
  console.log(appointID)
  }
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }
}