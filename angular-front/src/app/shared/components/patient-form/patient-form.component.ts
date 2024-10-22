import { Component, EventEmitter, Input, OnInit, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../modules/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from '../../../store/country-data.store';
import { Country } from '../../../interfaces/country.interface';
import { PatientService } from '../../../services/patient.service';
import { CustomValidators } from '../../../validators/CustomValidators';
import { AsyncValidators } from '../../../validators/AsyncValidators';


@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
})
export class PatientFormComponent implements OnInit {
  @Input() isEditMode: boolean = false; // Determina si es para edición o creación
  @Input() patientData: any = {}; // Datos del paciente que serán utilizados para edición
  @Output() formSubmit = new EventEmitter<any>(); // Emitir los datos del formulario al componente padre
  @Output() formReset = new EventEmitter<void>(); // Emitir cuando el formulario se reinicie
  public patientForm: FormGroup;
  public countries: Country[] = countries;
  public minDateBirth: Date;
  public maxDateBirth: Date;

  constructor(private formBuilder: FormBuilder, private patientService: PatientService) {
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;
  }

  ngOnInit(): void {
    this.patientForm = this.formBuilder.group({
      patientCode: [{ value: '0', disabled: true }, [Validators.required]],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], [AsyncValidators.checkDni(this.patientService)]],
      cip: ['', [CustomValidators.validCip()], [AsyncValidators.checkCip(this.patientService)]],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      address: [''],
      gender: ['', [Validators.required]]
    });

    if (this.isEditMode) {
      // Si estamos en modo edición, habilitamos el formulario para edición
      this.patientForm.enable();
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.formSubmit.emit(this.patientForm.value);
    }
  }

  resetForm() {
    this.patientForm.reset();
    this.patientForm.patchValue({ patientCode: '0' });
    this.formReset.emit();
  }
}