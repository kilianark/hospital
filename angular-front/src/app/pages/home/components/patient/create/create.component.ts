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
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { VERSION as MAT_VERSION } from '@angular/material/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { CustomValidators } from '../../../../../validators/CustomValidators';
import { AsyncValidators } from '../../../../../validators/AsyncValidators';



console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

bootstrapApplication(RequiredComponent, {
  providers: [provideAnimations(), provideHttpClient()],
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
  title = 'Crear Paciente:';
  patientForm: FormGroup;
  public countries: Country[] = countries;
  public patients: PatientInterface[] = [];
  public patientCode!: number;

  // Fecha actual
  today: Date = new Date();

  // Fecha mínima: 150 años antes de la fecha actual
  minDateBirth: Date = new Date(
    this.today.getFullYear() - 150,
    this.today.getMonth(),
    this.today.getDate()
  );

  // Fecha máxima: hoy
  maxDateBirth: Date = new Date();

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private patientService: PatientService // Inyectar el servicio
  ) {
    this.patientForm = this.formBuilder.group({
      patientCode: ['0', [Validators.required]],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], [AsyncValidators.checkDni(this.patientService)]],
      cip: ['', [CustomValidators.validCip()], [AsyncValidators.checkCip(this.patientService)]],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      address: [''],
      gender: ['', [Validators.required]],
    });

    this.patientForm.get('patientCode')?.disable();

  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.patientForm.get('patientCode')?.enable();

    const patientData: PatientInterface = {
      ...this.patientForm.value,
      //patientCode: this.nextPatientCode, //incrementación en BBDD
      zone: HospitalZone.Inactivo, //por defecto
      hospital: 'h1',
      bedId: null,
    };

    this.patientForm.get('patientCode')?.disable();

    console.log(this.patientForm.value);

    this.patientService.postPatientData(patientData).subscribe(
      (response) => {
        console.log('Paciente registrado:', response);
        this.confirm('Paciente registrado con éxito', 'success');
        this.confirm('Paciente registrado con éxito', 'success');
        this.router.navigate(['/home/patient/manage', { id: response.id }]); //que envíe al manage de este paciente
      },
      (error) => {
        this.confirm(
          'Error al registrar paciente. Inténtalo de nuevo.',
          'error'
        );
        console.error('Error al registrar el paciente:', error);
      }
    );
  }

  confirm(message: string, type: string) {
  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }

  resetForm() {
    this.patientForm.reset();
    this.patientForm.patchValue({
      patientCode: this.patientCode,
    });
  }
}
