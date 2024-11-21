import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { SharedModule } from '../../modules/shared.module';
import { countries } from '../../../store/country-data.store';
import { PatientService } from '../../../services/patient.service';
import { HospitalService } from '../../../services/hospital.service';
import { pdfGeneratorService } from '../../../services/pdfGenerator.service';
import { CustomValidators } from '../../../validators/CustomValidators';
import { AsyncValidators } from '../../../validators/AsyncValidators';
import { Country } from '../../../interfaces/country.interface';
import { HospitalInterface } from '../../../interfaces/hospital.interface';
import { KeycloakService } from 'keycloak-angular';


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
  @Input() patientCode: number;
  @Input() patientData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  // Form & Data
  public patientForm: FormGroup;
  public formTitle: string = 'Crear Paciente';
  public countries: Country[] = countries;
  public hospitals: HospitalInterface[] = [];
  private defaultHospital: HospitalInterface;
  public isEditable: boolean = false;

  private originalPatientData: any = {}; // Propiedad auxiliar

  // Date range
  public minDateBirth: Date;
  public maxDateBirth: Date;

  private userRoles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private patientService: PatientService,
    private pdfGeneratorService: pdfGeneratorService,
    private keycloakService: KeycloakService
  ) {
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadHospitalsData();
    this.loadPatientData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patientData'] && this.patientData) {
      this.originalPatientData = { ...this.patientData }; // Guardar copia de los datos originales
      this.fillFormWithPatientData();
      this.setFormFields();
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.formSubmit.emit(this.patientForm.getRawValue());  // getRawValue() para incluir los campos deshabilitados

      // Notificar al servicio sobre la actualización
      this.patientService.notifyPatientUpdated(this.patientForm.getRawValue());

      // Actualizar `originalPatientData` al último estado guardado
      this.originalPatientData = { ...this.patientForm.getRawValue() };

      // Cambia el modo editable si fuera necesario
      this.isEditable = false;
      this.setFormFields();
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
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], [AsyncValidators.checkDni(this.patientService, this.patientCode)]],
      cip: ['', [CustomValidators.validCip()], [AsyncValidators.checkCip(this.patientService, this.patientCode)]],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', Validators.email],
      country: ['', Validators.required],
      emergencyContact: ['', Validators.pattern(/^\d{9}$/)],
      address: [''],
      gender: ['', Validators.required],
      zone: [''],
      hospital: [{value: '', disabled: true}, Validators.required]
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
      this.patientService.getNextPatientCode().subscribe(nextPatientCode => {
        this.patientForm.patchValue({ patientCode: nextPatientCode });
      },
        error => {
          this.patientForm.patchValue({ patientCode: 1 })
          console.log(error)
        });
    }
  }

  /* Carga los hospitales disponibles */
  private loadHospitalsData(): void {
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals.filter(hospital => hospital.hospitalCode !== 0);
    });

    
    //gestionar hospital del usuario
    var hospCode = 0;
    this.userRoles = this.keycloakService.getKeycloakInstance().realmAccess?.roles;

    if(this.userRoles.includes('ADMIN')) this.patientForm.get('hospital').enable();
    else {
      if(this.userRoles.includes('Goldenfold')) hospCode = 1;
      else if (this.userRoles.includes('HospitalFaro')) hospCode = 2;
    }

    if (hospCode != 0) {
      this.hospitalService.getHospitalById(hospCode).subscribe((data) => {
        this.defaultHospital = data;
        this.patientForm.patchValue({ hospital: this.defaultHospital.hospitalCode })
      })
    }
  }

  /* Restaura el formulario a los datos originales antes de editarlos */
  discardForm(): void {
    // Limpia el formulario completamente
    this.patientForm.reset();

    this.patientForm.patchValue({ ...this.originalPatientData, birthDate: this.formatDate(this.originalPatientData.birthDate) });

    // Recarga `patientData` para restaurar el estado original
    //this.loadPatientData();

    // Cambia el modo editable si fuera necesario
    this.toggleEditMode();
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
    this.updateFormTitle();
    this.setFormFields();
  }

  /** Activa o desactiva los campos del formulario */
  private setFormFields(): void {
    if (this.isEditable) {
      this.patientForm.enable();
      this.patientForm.get('patientCode')?.disable();
      this.patientForm.get('hospital')?.disable();
    } else {
      this.patientForm.disable();
      this.patientForm.get('patientCode')?.disable();
      this.patientForm.get('hospital')?.disable();
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

  /** Cambia el titulo visible segun el modo */
  private updateFormTitle(): void {
    if (this.isEditMode) {
      this.formTitle = this.isEditable ? 'Editar Paciente' : 'Ficha Paciente';
    } else {
      this.formTitle = 'Crear Paciente';
    }
  }
}
