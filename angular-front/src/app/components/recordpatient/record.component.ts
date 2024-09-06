import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  patientForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.patientForm = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^\d{8}[A-Z]{2}$/)]],
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
}
