import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { SharedModule } from '../../modules/shared.module';
import { countries } from '../../../store/country-data.store';
import { PatientService } from '../../../services/patient.service';
import { pdfGeneratorService } from '../../../services/pdfGenerator.service';
import { CustomValidators } from '../../../validators/CustomValidators';
import { AsyncValidators } from '../../../validators/AsyncValidators';
import { Country } from '../../../interfaces/country.interface';


@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: PatientFormComponent }
  ]
})
export class PatientFormComponent implements OnInit {

  // Inputs & Outputs
  @Input() isEditMode: boolean = false;
  @Input() patientData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  // Form & Data
  public patientForm: FormGroup;
  public countries: Country[] = countries;
  public isEditable: boolean = false;

  // Date range
  public minDateBirth: Date;
  public maxDateBirth: Date;



  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private pdfGeneratorService: pdfGeneratorService
  ) {
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;
  }


  ngOnInit(): void {
    this.initForm();
    this.loadPatientData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patientData'] && this.patientData) {
      this.fillFormWithPatientData();
      this.setFormFields();
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.formSubmit.emit(this.patientForm.getRawValue());  // getRawValue() para incluir los campos deshabilitados

      // Notificar al servicio sobre la actualización
      this.patientService.notifyPatientUpdated(this.patientForm.getRawValue());
    }
  }


  /* Initializa el formulario con validaciones */
  private initForm(): void {
    this.patientForm = this.formBuilder.group({
      patientCode: [{ value: '', disabled: true }, Validators.required],
      id: [{ value: '0', disabled: true }, Validators.required],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], /*[AsyncValidators.checkDni(this.patientService, this.patientData?.patientCode)]*/],
      cip: ['', [CustomValidators.validCip()], /*[AsyncValidators.checkCip(this.patientService)]*/],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', Validators.email],
      country: ['', Validators.required],
      emergencyContact: ['', Validators.pattern(/^\d{9}$/)],
      address: [''],
      gender: ['', Validators.required],
      zone: [''],
      hospital: ['']
    });
  }

  /* Carga datos del paciente en el formulario y guarda los originales */
  private loadPatientData(): void {
    if (this.isEditMode) {
      this.setFormFields();
    }
    if (this.patientData) {
      const formattedDate = this.formatDate(this.patientData.birthDate);
      this.patientForm.patchValue({ ...this.patientData, birthDate: formattedDate });
    } else {
      this.patientService.getNextPatientCode().subscribe(nextPatientCode => {
        this.patientForm.patchValue({ patientCode: nextPatientCode });
      });
    }
  }

  /* Restaura el formulario a los datos originales antes de editarlos */
  discardForm(): void {
    // Limpia el formulario completamente
    this.patientForm.reset();

    // Recarga `patientData` para restaurar el estado original
    this.loadPatientData();

    // Cambia el modo editable si fuera necesario
    this.isEditable = false;
    this.setFormFields();
  }

  /* Reinicia el formulario dejando el patientCode intacto, todos los demas campos vacios */
  resetForm(): void {
    const currentPatientCode = this.patientForm.get('patientCode')?.value;
    this.patientForm.reset();
    this.patientForm.patchValue({ patientCode: currentPatientCode });
    this.formReset.emit();
  }

  /** Alterna el modo de edición */
  toggleEditMode(): void {
    this.isEditable = !this.isEditable;
    this.setFormFields();
  }

  /** Activa o desactiva los campos del formulario */
  private setFormFields(): void {
    if (this.isEditable) {
      this.patientForm.enable();
      this.patientForm.get('patientCode')?.disable();
    } else {
      this.patientForm.disable();
      this.patientForm.get('patientCode')?.disable();
    }
  }

  /** Llena el formulario con los datos del paciente formateados */
  private fillFormWithPatientData(): void {
    const formattedDate = this.formatDate(this.patientData.birthDate);
    this.patientForm.patchValue({
      ...this.patientData,
      birthDate: formattedDate,
      id: this.patientData.id
    });
  }

  /** Genera el PDF con los datos actuales del formulario */
  generatePatientPDF(): void {
    this.pdfGeneratorService.generatePDF(this.patientForm.value);
  }

  /** Formatea la fecha eliminando la hora */
  private formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }
}