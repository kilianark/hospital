import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component';
import { Router } from '@angular/router';

import { countries } from '../../../../store/country-data.store';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../interfaces/country.interface';
import { DoctorInterface } from '../../../../interfaces/doctor.interface';

@Component({
  selector: 'app-profile',
  //standalone: true,
  //imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  
  constructor(private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
      dni: [this.doctor.dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: [this.doctor.cip, [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: [this.doctor.name, [Validators.required]],
      birth: [this.doctor.birthdate, [Validators.required]],  // Fecha en formato YYYY-MM-DD
      surname1: [this.doctor.surname1, [Validators.required]],
      surname2: [this.doctor.surname2, [Validators.required]],
      phone: [this.doctor.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [this.doctor.email, [Validators.email]],
      country: [this.doctor.country, [Validators.required]],
      gender: [this.doctor.gender, [Validators.required]],
      user: [this.doctor.doctor_code, [Validators.required]],
      address: [this.doctor.address, [Validators.required]]
    });
  }

  public countries: Country[] = countries;

  
  doctor: DoctorInterface = {
    id: 2,
    doctor_code: 45362,
    name: "Andrés",
    surname1: "Rodríguez",
    surname2: "Martínez",
    phone: 616273627,
    age: 32,
    birthdate: new Date(2022, 11, 24),
    address: "c/ Mallorca 123, 3C 08020 Barcelona España",
    dni: "47586754A",
    cip: "LOMA 12345123",
    email: "andresroma@gmail.com",
    country: countries[208].name,
    gender: "man",
    speciality: "Cardiólogo"
  }

  onSubmit() {
    if(this.profileForm.invalid) return;

    console.log('Perfil actualizado');
    this.confirm();
  }

  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage("Perfil Actualizado")
  }

}
