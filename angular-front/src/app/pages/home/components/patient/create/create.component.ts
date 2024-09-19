import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */

import { countries } from '../../../../../store/country-data.store';
import { Country } from '../../../../../interfaces/country.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';



@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-create-patient',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreatePatientComponent {
  patientForm: FormGroup;
  public countries: Country[] = countries;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private patientService: PatientService // Inyectar el servicio
  ) {
    this.patientForm = this.formBuilder.group({
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
      gender: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    const patientData: PatientInterface = {
      ...this.patientForm.value,
      //AGE se calculará en la BBDD
      patientCode: 0, //incrementación en BBDD
      status: 'Inactivo', //por defecto
      reason: '',
      bedId: null,
    };

    console.log(patientData.birthDate)

    this.patientService.postPatientData(patientData).subscribe(
      (response) => {
        
        console.log('Paciente registrado:', response);
        this.confirm();
        this.router.navigate(['/home/patient/manage', {id : patientData.id}]); //que envíe al manage de este paciente
      },
      (error) => {
        console.error('Error al registrar el paciente:', error);
      }
    );
  }

  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage("Paciente Registrado");
  }
}
