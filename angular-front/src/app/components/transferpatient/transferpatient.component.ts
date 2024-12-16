import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { HospitalInterface } from '../../interfaces/hospital.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HospitalService } from '../../services/hospital.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-transferpatient',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './transferpatient.component.html',
  styleUrl: './transferpatient.component.css'
})
export class TransferpatientComponent implements OnInit {
  hospitals: HospitalInterface[] = [];
  patient: PatientInterface;

  transferForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: PatientInterface,
    private hospitalService: HospitalService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TransferpatientComponent>
  ) {
    this.transferForm = this.formBuilder.group({
      hospital: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.patient = this.data;
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals.filter(hospital => hospital.hospitalCode != this.patient.hospital)
    })
  }

  onSubmit() {
    this.patient.hospital = this.transferForm.get("hospital")?.value;
    this.patient.bedId = null;
    this.patientService.putPatientData(this.patient).subscribe(() => {});

    this.dialogRef.close(this.patient);
  }
}
