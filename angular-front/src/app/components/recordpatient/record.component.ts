import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { countries } from '../../store/country-data.store';
import { Country } from '../../interfaces/country.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  patientForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.patientForm = this.formBuilder.group({
      dni: [this.patient.dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: [this.patient.cip, [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: [this.patient.name, [Validators.required]],
      birth: [this.patient.birthdate.toISOString().split('T')[0], [Validators.required]],
      surname1: [this.patient.surname1, [Validators.required]],
      surname2: [this.patient.surname2, ],
      phone: [this.patient.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [this.patient.email, [Validators.email]],
      country: [this.patient.country, [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      gender: [this.patient.gender, [Validators.required]]
    });
  }

  public countries: Country[] = countries;
  isEditable: boolean = false;

  patient: PatientInterface = {
    code: 1,
    name: "Juan",
    surname1: "Martínez",
    surname2: "López",
    dni: "00000000B",
    cip: "LOMA 00000002",
    gender: "man",
    phone: "999999999",
    email: "julo90@gmail.com",
    age: 54,
    birthdate: new Date("1970-09-12"),
    country: countries[208].name,
    status: "",
    idBed: ""
  }

}
