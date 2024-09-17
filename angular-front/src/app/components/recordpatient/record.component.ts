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

    id: 0,
    name: "Juan",
    surname1: "Martínez",
    surname2: "López",
    gender: "man",
    birthdate: new Date("1970-09-12"),
    age: 54,
    country: countries[208].name,
    address: "C. Fluvià 65, 4, 08002, Barcelona",
    dni: "00000000B",
    cip: "LOMA 00000002",
    email: "julo90@gmail.com",
    phone: "999999999",

    patient_code: 123456,
    emergencyContact: "999999999",
    status:""
  }

  camps: string[] = ['dni', 'cip', 'name', 'birth', 'surname1', 'surname2', 'phone', 'email', 'country',
                    'emergencyContact', 'gender', 'address'] 
  
  constructor(private formBuilder: FormBuilder) {
    this.patientForm = this.formBuilder.group({
      
      name: [this.patient.name, [Validators.required]],
      surname1: [this.patient.surname1, [Validators.required]],
      surname2: [this.patient.surname2, ],
      gender: [this.patient.gender, [Validators.required]],
      birth: [this.patient.birthdate.toISOString().split('T')[0], [Validators.required]],
      country: [this.patient.country, [Validators.required]],
      address: [this.patient.address],
      dni: [this.patient.dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: [this.patient.cip, [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      email: [this.patient.email, [Validators.email]],
      phone: [this.patient.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      
      patientCode: [this.patient.patient_code],
      emergencyContact: [this.patient.emergencyContact, [Validators.pattern(/^\d{9}$/)]],
      
    });

    this.patientForm.get('patientCode')?.disable();
    for (const value of this.camps) {
      this.patientForm.get(value)?.disable();
    }

  }

  togleIsEditable(){
    this.isEditable = !this.isEditable;

    if(this.isEditable){
      for (const value of this.camps) {
        this.patientForm.get(value)?.enable();
      }
    } else {
      for (const value of this.camps) {
        this.patientForm.get(value)?.disable();
      }
    }
  }

}
