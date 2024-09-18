import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { countries } from '../../store/country-data.store';
import { Country } from '../../interfaces/country.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';


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

  patient: PatientInterface[] = [

  ];

  camps: string[] = ['dni', 'cip', 'name', 'birth', 'surname1', 'surname2', 'phone', 'email', 'country',
                    'emergencyContact', 'gender', 'address'] 
  
  constructor(private formBuilder: FormBuilder, private patientService: PatientService) {
    this.patientForm = this.formBuilder.group({
      
      name: [this.patient[0].name, [Validators.required]],
      surname1: [this.patient[0].surname1, [Validators.required]],
      surname2: [this.patient[0].surname2, ],
      gender: [this.patient[0].gender, [Validators.required]],
      birth: [this.patient[0].birthdate.toISOString().split('T')[0], [Validators.required]],
      country: [this.patient[0].country, [Validators.required]],
      address: [this.patient[0].address],
      dni: [this.patient[0].dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: [this.patient[0].cip, [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      email: [this.patient[0].email, [Validators.email]],
      phone: [this.patient[0].phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      
      patientCode: [this.patient[0].patient_code],
      emergencyContact: [this.patient[0].emergencyContact, [Validators.pattern(/^\d{9}$/)]],
      
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
