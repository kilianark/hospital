import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
export class RecordComponent implements OnInit {
  isEditable: boolean = false;
  public countries: Country[] = countries;
  patientForm: FormGroup;
  public patientSurname : string = "Hola";

  patient: PatientInterface[] = [

  ];

  camps: string[] = ['dni', 'cip', 'name', 'birth', 'surname1', 'surname2', 'phone', 'email', 'country',
                    'emergencyContact', 'gender', 'address', 'patientCode'] 
  
  constructor(private formBuilder: FormBuilder, private patientService: PatientService) {

    this.patientForm = this.formBuilder.group({
      
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: [''],
      gender: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: [''],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      
      patientCode: [''],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]]
      
    });

    this.patientForm.get('patientCode')?.disable();
    for (const value of this.camps) {
      this.patientForm.get(value)?.disable();
    }

    this.patientService.getPatientData().subscribe(data => {
      this.patient = data.map(patient => ({
        ...patient,
        birthDate: new Date(patient.birthDate) 
      }));
      

      this.patientForm.patchValue({
        name: this.patient[0].name,
        surname1: this.patient[0].surname1,
        surname2: this.patient[0].surname2,
        gender: this.patient[0].gender,
        birth: this.patient[0].birthDate.toISOString().split('T')[0],
        country: this.patient[0].country,
        address: this.patient[0].address,
        dni: this.patient[0].dni,
        cip: this.patient[0].cip,
        email: this.patient[0].email,
        phone: this.patient[0].phone,
        
        patientCode: this.patient[0].patientCode,
        emergencyContact:this.patient[0].emergencyContact
        
      });
    })
  }

  ngOnInit(): void {
    
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
