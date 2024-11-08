import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientInterface } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';
import { pdfGeneratorService } from '../../services/pdfGenerator.service';
import { PatientFormComponent } from "../../shared/components/patient-form/patient-form.component";
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-record',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PatientFormComponent, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
})
export class RecordComponent implements OnInit {
  public patient: PatientInterface;
  isEditable: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private patientService: PatientService,
    private pdfGeneratorService: pdfGeneratorService
  ) { }

  ngOnInit(): void {
    // Obtener los datos del paciente basado en la ID recibida desde el MAT_DIALOG_DATA
    this.patientService.getPatientData(this.data).subscribe((patient) => {
      this.patient = patient[0];  // Asumiendo que getPatientData devuelve un array
      console.log("Paciente obtenido en record-component: " + this.patient);
      // Aquí asegúrate de que los datos del paciente estén cargados correctamente en el formulario
      this.patchFormData(this.patient);
    });
  }

  // Método para llenar el formulario con los datos del paciente cuando se carguen
  patchFormData(patientData: PatientInterface) {
    if (patientData) {
      this.patient = patientData;
    }
  }

  // Llamada a la función del servicio que genera el PDF
  generatePatientPDF() {
    this.pdfGeneratorService.generatePDF(this.patient);
  }

  // Cuando el formulario se envía, actualizar el paciente en el servidor
  onFormSubmit(updatedPatientData: PatientInterface) {
    this.patientService.putPatientData(updatedPatientData).subscribe((response) => {
      this.patient = response;  // Actualizar los datos del paciente
    });
  }

  // Alternar entre el modo de edición y visualización
  toggleEditMode() {
    this.isEditable = !this.isEditable;
  }
}