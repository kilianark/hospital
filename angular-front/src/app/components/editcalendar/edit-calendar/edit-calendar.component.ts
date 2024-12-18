import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientInterface } from '../../../interfaces/patient.interface';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentInterface } from '../../../interfaces/appointment.interface';
import { MatFormField } from '@angular/material/form-field';
import { SharedModule } from '../../../shared/modules/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DoctorInterface } from '../../../interfaces/doctor.interface';
import { DoctorService } from '../../../services/doctor.service';
import { KeycloakService } from 'keycloak-angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ConfirmComponent } from '../../confirm/confirm.component';


@Component({
  selector: 'app-edit-calendar',
  standalone: true,
  imports: [MatDatepickerModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatFormField, SharedModule, NgxMaterialTimepickerModule],
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.css']
})
export class EditCalendarComponent implements OnInit {
  title = 'Edit Calendar';
  public patient: PatientInterface;
  public doctor: DoctorInterface;
  public doctors: Array<{ id: number; name: string }> = [];
  public workerCode!: number; // Asegurarse de que esté correctamente tipado
  AdoctorId!: number; // Asegurarse de que esté correctamente tipado
  isEditable: boolean = false;
  editForm: FormGroup;
  public appointment: AppointmentInterface;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private patientService: PatientService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private keycloak: KeycloakService,
    private doctorService: DoctorService,
    public dialog: MatDialog,
  ) { }

  

  ngOnInit(): void {
    // Primero carga los datos de la cita
    this.loadAppointmentData();

    // Luego inicializa el formulario
    this.editForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      doctorId: ['', Validators.required],
      reason: ['']
    });

    // Cargar datos del perfil del usuario
    this.keycloak.loadUserProfile().then((profile) => {
      this.workerCode = profile.attributes['workerCode'][0];
      console.log(this.workerCode);

      // Obtener los datos del doctor basado en el workerCode
      this.doctorService.getDoctorData(this.workerCode).subscribe((data) => {
        if (data.length > 0) {
          this.doctor = data[0];
          this.AdoctorId = this.doctor.id;
          console.log(this.AdoctorId);
        }
      });
    });

    // Cargar opciones de doctores
    this.loadDoctorOptions();
  }

  patchFormData(appointmentData: AppointmentInterface) {
    if (appointmentData) {
      this.appointment = appointmentData;
    }
  }

  // Método para cargar los datos de la cita y actualizar el formulario
  private loadAppointmentData() {
    this.appointmentService.getAppointmentById(this.data).subscribe((appointment) => {
      this.appointment = appointment; // Suponiendo que la API devuelve un array

      if (this.appointment) {
        // Asegurarse de que los valores de la cita estén en el formato adecuado
        const appointmentDate = new Date(this.appointment.appointmentDate);
        const appointmentUTC = new Date(Date.UTC(
        appointmentDate.getFullYear(), 
        appointmentDate.getMonth(), 
        appointmentDate.getDate(), 
        appointmentDate.getHours(), 
        appointmentDate.getMinutes(),
        appointmentDate.getSeconds()));// Formato "MM/DD/YYYY"
        

        const formattedDate = appointmentUTC.toISOString().split('T')[0];
        console.log(formattedDate);
        const dateHours = appointmentUTC.getUTCHours();
        const dateMinutes = appointmentUTC.getUTCMinutes();
        const dateTimeFormat = this.formatDateHours(dateHours, dateMinutes)

        this.editForm.patchValue({
          date: formattedDate,
          time: dateTimeFormat,
          doctorId: this.appointment.doctorId
        });
      }
    });
  }

  // Cargar la lista de doctores para el dropdown
  private loadDoctorOptions() {
    this.doctorService.getDoctorData().subscribe((doctors) => {
      this.doctors = doctors; // Lista de doctores para el dropdown
      console.log('Doctores cargados:', this.doctors);
    });
  }

  // Cuando el formulario se envía, actualizar la cita en el servidor
  onFormSubmit() {
    if (this.editForm.valid) {

      const appointmentDate = new Date(this.editForm.value.date);
      const appointmentDateUTC = new Date(Date.UTC(
        appointmentDate.getFullYear(), 
        appointmentDate.getMonth(), 
        appointmentDate.getDate(), 
        this.editForm.value.time.split(":")[0],
        this.editForm.value.time.split(":")[1]
      ));
      // Combina los datos del formulario con los datos actuales de la cita
      const updatedData: AppointmentInterface = {
        ...this.appointment,
        appointmentDate: appointmentDateUTC,
        doctorId:this.editForm.value.doctorId  // Se sobrescriben los campos que se han actualizado
      };
      console.log(updatedData)
      this.appointmentService.updateAppointment(this.data, updatedData).subscribe((response) => {
        console.log('Appointment updated:', response);
        this.confirm('Cita actualizada con éxito', 'success');
      });
    } 
  }

  formatDateHours(hours: number, minutes: number) : string {
    var hoursString = hours >= 10 ? hours.toString() : "0" + hours.toString();
    var minutesString = minutes >= 10 ? minutes.toString(): "0" + minutes.toString();
    return hoursString + ":" + minutesString
  }
   confirm(message: string, type: string) {
      const dialogRef = this.dialog.open(ConfirmComponent, {});
      dialogRef.componentInstance.setMessage(message, type);
    }
}
