import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
    this.patientService.getPatientData(this.data).subscribe((patient) => {
      this.patient = patient[0];
      this.patchFormData(this.patient);
    });
  }

  patchFormData(patientData: PatientInterface) {
    if (patientData) {
      this.patient = patientData;
    }
  }

  generatePatientPDF() {
    this.pdfGeneratorService.generatePDF(this.patient);
  }

  onFormSubmit(updatedPatientData: PatientInterface) {
    this.patientService.putPatientData(updatedPatientData).subscribe((response) => {
      this.patient = response; 
    });
  }

  toggleEditMode() {
    this.isEditable = !this.isEditable;
  }
}