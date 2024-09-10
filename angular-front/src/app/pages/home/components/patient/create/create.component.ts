import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */

import { countries } from '../../../store/country-data.store';
import { Country } from '../../../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-create-patient',
  //standalone: true,
  //imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {
  patientForm: FormGroup;
  constructor(private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.patientForm = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['Spain', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      sex: ['', [Validators.required]]
    });
  }

  public countries: Country[] = countries;

  onSubmit() {
    if(this.patientForm.invalid) return;

    console.log('Pacient registrat:', this.patientForm.value);
    this.confirm();
    this.router.navigate(['/home']);
  }

  confirm() {
    this.dialog.open(ConfirmComponent, {});
  }
}
