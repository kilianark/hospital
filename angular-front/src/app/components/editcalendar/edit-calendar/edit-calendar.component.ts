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
@Component({
  selector: 'app-edit-calendar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatDialogModule,MatFormField,SharedModule],
  templateUrl: './edit-calendar.component.html',
  styleUrl: './edit-calendar.component.css'
})
export class EditCalendarComponent {
  title = 'Edit Calendar';
  public patient: PatientInterface;
  isEditable: boolean = false;
  public appointment: AppointmentInterface;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
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
    }
  }



  // Cuando el formulario se envía, actualizar el paciente en el servidor
  onFormSubmit(updatedPatientData: AppointmentInterface) {
    this.appointmentService.updateAppointment(this.data, updatedPatientData).subscribe((response) => {
      this.appointment = response;  // Actualizar los datos del paciente
    });
  }

  // Alternar entre el modo de edición y visualización
  

}
