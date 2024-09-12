import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { countries } from '../../store/country-data.store';
import { Country } from '../../interfaces/country.interface';
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
      dni: [this.dni, [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: ['', ],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['Spain', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      sex: ['', [Validators.required]]
    });
  }

  public countries: Country[] = countries;
  isEditable: boolean = false;

  name: string = "Juan";
  dni: string = "00000000B";
  surname1: string = "Martínez";
  cip: string = "LOMA 00000002";
  surname2: string = "López";
  sex: string = "Masculino";
  phone: string = "999999999";
}
