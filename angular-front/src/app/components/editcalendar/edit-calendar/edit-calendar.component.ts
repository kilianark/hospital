import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientInterface } from '../../../interfaces/patient.interface';
import { PatientComponent } from '../../../pages/home/components/patient/patient.component';
import { PatientFormComponent } from "../../../shared/components/patient-form/patient-form.component";
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentInterface } from '../../../interfaces/appointment.interface';
import { CalendarComponent } from '../../../pages/home/components/consultation/calendar/calendar.component';
import { MatFormField } from '@angular/material/form-field';
import { identity } from 'rxjs';
import { SharedModule } from '../../../shared/modules/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DoctorInterface } from '../../../interfaces/doctor.interface';
import { DoctorService } from '../../../services/doctor.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-edit-calendar',
  standalone: true,
  imports: [MatDatepickerModule,ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatDialogModule,MatFormField,SharedModule, KeycloakService, DoctorService],
  templateUrl: './edit-calendar.component.html',
  styleUrl: './edit-calendar.component.css'
})
export class EditCalendarComponent {
  title = 'Edit Calendar';
  public patient: PatientInterface;
  public doctor: DoctorInterface;
  public doctors: Array<{ id: number; name: string }> = [];
  public workerCode!: number; // Ensure it's properly typed
  AdoctorId!: number; // Ensure it's properly typed
  isEditable: boolean = false;
  editForm: FormGroup;
  public appointment: AppointmentInterface;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private patientService: PatientService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private keycloak: KeycloakService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      date: ['', Validators.required],
      doctorId: ['', Validators.required],
      reason: ['']
 // doctorId matches the selected doctor
 
    });
    this.keycloak.loadUserProfile().then((profile) => {
      this.workerCode = profile.attributes['workerCode'][0];
      console.log(this.workerCode);
      this.doctorService.getDoctorData(this.workerCode).subscribe((data) => {
        if(data.length > 0) this.doctor = data[0];
        this.AdoctorId = this.doctor.id;
        console.log(this.AdoctorId);
      });
    });
    // Obtener los datos del paciente basado en la ID recibida desde el MAT_DIALOG_DATA
    this.appointmentService.getAppointmentById(this.data).subscribe((appointment) => {
      this.appointment = appointment[0];  // Asumiendo que getPatientData devuelve un array
      console.log("Paciente obtenido en record-component: " + this.appointment);
      // Aquí asegúrate de que los datos del paciente estén cargados correctamente en el formulario
      this.patchFormData(this.appointment);
    });
  }

  // Método para llenar el formulario con los datos del paciente cuando se carguen
  patchFormData(appointmentData: AppointmentInterface) {
    if (appointmentData) {
      this.appointment = appointmentData;
      console.log("Datos del paciente cargados en el formulario: " + this.appointment);
    }
  }
  // Método para llenar el formulario con los datos del paciente cuando se carguen
  patchFormDataPatient(patientData: PatientInterface) {
    if (patientData) {
      this.patient = patientData;
      console.log("Datos del paciente cargados en el formulario: " + this.patient);
    }
  }

  // Load appointment data and patch the form
  private loadAppointmentData() {
    this.appointmentService.getAppointmentById(this.data).subscribe((appointment) => {
      this.appointment = appointment[0]; // Assuming the API returns an array
      if (this.appointment) {
        this.editForm.patchValue({
          date: this.appointment.appointmentDate,
          doctorId: this.appointment.doctorId // Assuming `doctorId` is part of the appointment object
        });
      }
    });
  }

  // Load doctors for the dropdown
  private loadDoctorOptions() {
    this.doctorService.getDoctorData().subscribe((doctors) => {
      this.doctors = doctors; // Assuming the API returns an array of { id, name }
    });
  }

  // Cuando el formulario se envía, actualizar el paciente en el servidor
  onFormSubmit() {
    if (this.editForm.valid) {
      // Merge the form values with the existing appointment data
      const updatedData: AppointmentInterface = {
        ...this.appointment, // Ensure all required fields from the original object are included
        ...this.editForm.value // Overwrite fields being updated
      };
  
      this.appointmentService.updateAppointment(this.data, updatedData).subscribe((response) => {
        console.log('Appointment updated:', response);
      });
    }
  }

  getPatientData() {
    this.patientService.getPatientById(this.appointment.patientId).subscribe((patient) => {
      this.patient = patient[0];  // Asumiendo que getPatientData devuelve un array
      console.log("Paciente obtenido en record-component: " + this.patient);
      // Aquí asegúrate de que los datos del paciente estén cargados correctamente en el formulario
      this.patchFormDataPatient(this.patient);
    });
  }


}
