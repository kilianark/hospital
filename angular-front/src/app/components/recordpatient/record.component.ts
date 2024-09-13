import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { countries } from '../../store/country-data.store';
import { Country } from '../../interfaces/country.interface';
import { PatientInterface } from '../../interfaces/patient.interface';


@Component({
  selector: 'app-record',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  isEditable: boolean = false;
  public countries: Country[] = countries;
  patientForm: FormGroup;

  patient: PatientInterface = {
    code: 123456,
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
    address: "C. Fluvià 65, 4, 08002, Barcelona",
    emergencyContact: "999999999",
    idBed: ""
  }
  
  constructor(private formBuilder: FormBuilder) {
    this.patientForm = this.formBuilder.group({
      patientCode: [this.patient.code],
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
      gender: [this.patient.gender, [Validators.required]],
      address: [this.patient.address]
    });

    this.patientForm.get('patientCode')?.disable();
    this.patientForm.get('dni')?.disable();
    this.patientForm.get('cip')?.disable();
    this.patientForm.get('name')?.disable();
    this.patientForm.get('birth')?.disable();
    this.patientForm.get('surname1')?.disable();
    this.patientForm.get('surname2')?.disable();
    this.patientForm.get('phone')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('country')?.disable();
    this.patientForm.get('emergencyContact')?.disable();
    this.patientForm.get('gender')?.disable();
    this.patientForm.get('address')?.disable();

  }

  togleIsEditable(){
    this.isEditable = !this.isEditable;

    if(this.isEditable){
      this.patientForm.get('gender')?.enable();
      this.patientForm.get('birth')?.enable();
    } else {
      this.patientForm.get('gender')?.disable();
      this.patientForm.get('birth')?.disable();
    }
  }
}
