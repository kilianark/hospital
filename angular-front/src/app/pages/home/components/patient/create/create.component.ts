import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */

import { countries } from '../../../../../store/country-data.store';
import { Country } from '../../../../../interfaces/country.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { RequiredComponent } from '../../../../../components/required/required.component';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import {
  VERSION as MAT_VERSION,
  MatNativeDateModule,
} from '@angular/material/core';
import { PatientStatus } from '../../../../../enums/patient-status.enum';

console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

bootstrapApplication(RequiredComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
  ],
}).catch((err) => console.error(err));

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-create-patient',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreatePatientComponent implements OnInit {
  patientForm: FormGroup;
  public countries: Country[] = countries;
  public patients: PatientInterface[] = [];
  public patientCode!: number;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private patientService: PatientService // Inyectar el servicio
  ) {
    this.patientForm = this.formBuilder.group({
      patientCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: [''],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      birthDate: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      address: [''],
      gender: ['', [Validators.required]],
    });

    this.patientForm.get('patientCode')?.disable();

    this.nextPatientCode()
      .then((code: number) => {
        this.patientCode = code;
        this.patientForm.patchValue({
          patientCode: this.patientCode,
        });
      })
      .catch((error: Error) => {
        console.log('MSG RANDOM');
      });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.patientForm.get('patientCode')?.enable();

    const patientData: PatientInterface = {
      ...this.patientForm.value,
      //patientCode: this.nextPatientCode, //incrementación en BBDD
      status: PatientStatus.Inactivo, //por defecto
      reason: '',
      bedId: null,
    };

    console.log(this.patientForm.value);

    this.patientService.postPatientData(patientData).subscribe(
      (response) => {
        console.log('Paciente registrado:', response);
        //this.confirm();
        this.router.navigate(['/home/patient/manage', { id: response.id }]); //que envíe al manage de este paciente
      },
      (error) => {
        console.error('Error al registrar el paciente:', error);
      }
    );
  }

  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage('Paciente Registrado');
  }

  //canviar en algún momento
  async nextPatientCode(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.patientService.getPatientData().subscribe(
        (data) => {
          this.patients = data;
          if (!this.patients || this.patients.length < 1) resolve(1);
          else resolve(this.patients[this.patients.length - 1].patientCode + 1);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
