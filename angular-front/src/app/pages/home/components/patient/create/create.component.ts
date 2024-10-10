import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */
import { Router } from '@angular/router';
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
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { CustomValidators } from '../../../../../validators/CustomValidators';



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

  maxDateBirth: string;
  minDateBirth: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private patientService: PatientService // Inyectar el servicio

  ) {
    this.patientForm = this.formBuilder.group({
      patientCode: ['', [Validators.required]],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDni()]],
      cip: ['', [CustomValidators.validCip()]],
      birthDate: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      address: [''],
      gender: ['', [Validators.required]],
    });

    // Fecha actual para el máximo (hoy)
    const today = new Date();
    this.maxDateBirth = this.formatDate(today);

    // Restar 150 años para el mínimo
    const minDate = new Date(today.setFullYear(today.getFullYear() - 150));
    this.minDateBirth = this.formatDate(minDate);

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

  ngOnInit(): void { }

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.patientForm.get('patientCode')?.enable();

    const patientData: PatientInterface = {
      ...this.patientForm.value,
      //patientCode: this.nextPatientCode, //incrementación en BBDD
      status: HospitalZone.Inactivo, //por defecto
      reason: '',
      bedId: null,
    };

    this.patientForm.get('patientCode')?.disable();

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

  resetForm() {
    this.patientForm.reset();
    this.patientForm.patchValue({
      patientCode: this.patientCode,
    });
  }

  // Función para formatear la fecha en yyyy-mm-dd
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
