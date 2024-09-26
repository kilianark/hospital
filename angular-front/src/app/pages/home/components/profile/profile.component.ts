import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component';


import { countries } from '../../../../store/country-data.store';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../interfaces/country.interface';
import { DoctorInterface } from '../../../../interfaces/doctor.interface';
import { DoctorService } from '../../../../services/doctor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private doctorService : DoctorService) {
    this.profileForm = this.formBuilder.group({
      dni: [this.doctor.dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: [this.doctor.cip, [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: [this.doctor.name, [Validators.required]],
      birth: [this.doctor.birthdate.toISOString().split('T')[0], [Validators.required]],  // Fecha en formato YYYY-MM-DD
      surname1: [this.doctor.surname1, [Validators.required]],
      surname2: [this.doctor.surname2, [Validators.required]],
      phone: [this.doctor.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [this.doctor.email, [Validators.email]],
      country: [this.doctor.country, [Validators.required]],
      gender: [this.doctor.gender, [Validators.required]],
      user: [this.doctor.user, [Validators.required]],
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
    birthdate: new Date("1990-02-15"),
    address: "c/ Mallorca 123, 3C 08020 Barcelona España",
    dni: "47586754A",
    cip: "LOMA 12345123",
    email: "andresroma@gmail.com",
    country: countries[0].name,
    gender: "man",
    worker_type:"Doctor",
    speciality: "Cardiólogo",
    user: "anroma45362"
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
