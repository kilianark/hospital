import { Component, EventEmitter, Input, OnInit, Output, NgModule, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../modules/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from '../../../store/country-data.store';
import { Country } from '../../../interfaces/country.interface';
import { PatientService } from '../../../services/patient.service';
import { CustomValidators } from '../../../validators/CustomValidators';
import { AsyncValidators } from '../../../validators/AsyncValidators';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldControl } from '@angular/material/form-field';
import { pdfGeneratorService } from '../../../services/pdfGenerator.service';


@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, MatInputModule, MatSelectModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: PatientFormComponent }
  ]
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
  public isEditable: boolean = false; // Controla si el formulario es editable


  constructor(private formBuilder: FormBuilder, private patientService: PatientService, private pdfGeneratorService: pdfGeneratorService) {
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;
  }

  ngOnInit(): void {
    if (!this.isEditMode) {
      // Llamar al servicio para obtener el próximo patientCode como número
      this.patientService.getNextPatientCode().subscribe(nextPatientCode => {
        this.patientForm.patchValue({ patientCode: nextPatientCode });
      });
    }

    this.patientForm = this.formBuilder.group({
      patientCode: [{ value: '', disabled: true }, [Validators.required]],
      id: [{ value: '', disabled: true }, [Validators.required]],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], /*[AsyncValidators.checkDni(this.patientService, this.patientData?.patientCode)]*/],
      cip: ['', [CustomValidators.validCip()], /*[AsyncValidators.checkCip(this.patientService)]*/],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
      address: [''],
      gender: ['', [Validators.required]],
      zone: [''],
      hospital: ['']
    });
    // Formatear la fecha antes de llenar el formulario
    if (this.patientData) {
      const formattedDate = this.formatDate(this.patientData.birthDate);
      this.patientForm.patchValue({
        ...this.patientData,
        birthDate: formattedDate
      });
    }

    // Si estamos en edición, deshabilitar los campos inicialmente
    if (this.isEditMode) {
      this.toggleFormFields();
    }
  }

  generatePatientPDF() {
    this.pdfGeneratorService.generatePDF(this.patientForm.value);
  }

  // Detectar cambios en los datos del paciente para actualizar el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['patientData'] && this.patientData) {
      this.fillFormWithPatientData();
      this.toggleFormFields();
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.formSubmit.emit(this.patientForm.getRawValue());  // getRawValue() para incluir los campos deshabilitados

      // Notificar al servicio sobre la actualización
      this.patientService.notifyPatientUpdated(this.patientForm.getRawValue());
    }
  }

  resetForm() {
    const currentPatientCode = this.patientForm.get('patientCode')?.value;  // Guardar el valor actual de patientCode
    this.patientForm.reset();  // Limpiar todos los campos del formulario

    // Volver a establecer el valor de patientCode después de hacer reset
    this.patientForm.patchValue({ patientCode: currentPatientCode });

    this.formReset.emit();
  }

  // Alternar el modo de edición
  toggleEditMode() {
    this.isEditable = !this.isEditable;
    this.toggleFormFields();
  }

  // Habilitar o deshabilitar los campos del formulario
  toggleFormFields() {
    if (this.isEditable) {
      this.patientForm.enable(); // Habilitar todos los campos
      this.patientForm.get('patientCode')?.disable(); // Mantener el patientCode deshabilitado
    } else {
      this.patientForm.disable(); // Deshabilitar todos los campos
      this.patientForm.get('patientCode')?.disable(); // Asegurar que el patientCode sigue deshabilitado
    }
  }

  fillFormWithPatientData() {
    const formattedDate = this.formatDate(this.patientData.birthDate);
    this.patientForm.patchValue({
      ...this.patientData,
      birthDate: formattedDate,
      id: this.patientData.id  // Asegúrate de pasar también el id
    });
  }

  // Formatear fecha para quitar la parte de hora
  formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }
}