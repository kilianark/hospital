import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { HospitalService } from '../../../services/hospital.service';
import { countries } from '../../../store/country-data.store';
import { WorkerInterface } from '../../../interfaces/worker.interface';
import { CustomValidators } from '../../../validators/CustomValidators';
import { AsyncValidatorsW } from '../../../validators/AsyncValidatorsW';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorInterface } from '../../../interfaces/doctor.interface';
import { count } from 'rxjs';
import { MaterialModule } from '../../modules/material.module';
import { EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { SharedModule } from '../../modules/shared.module';
import { ActivatedRoute } from '@angular/router';
import { NurseInterface } from '../../../interfaces/nurse.interface';
import { NurseService } from '../../../services/nurse.service';
import { AdminService } from '../../../services/administrator.service';
import { Administrator } from '../../../interfaces/administrator.interface';
import { Speciality } from '../../../interfaces/speciality.interface';
import {specialities} from '../../../store/specialities.store';


@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule, SharedModule,CommonModule],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.css',
  providers: [
    { provide: MatFormFieldControl, useExisting: WorkerFormComponent }
  ]
})
export class WorkerFormComponent implements OnInit{
  public Specialities = specialities;
  @Input() isEditMode: boolean = false;
  @Input() workerCode: string;
  @Input() workerData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();
  public workerForm: FormGroup;
  public countries = countries;
  public formTitle: string = '';
  public hospitals: any[] = [];
  public minDateBirth: Date;
  public maxDateBirth: Date;
  public id?: number;
  public lastId: number = 0;
  public workerCount:number = 0;
  public isEditable: boolean = false;
  public doctorID : number;
  public profileForm: FormGroup;
  public doctor: DoctorInterface;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private workerService: WorkerService,
    private doctorService: DoctorService,
    private hospitalService: HospitalService,
    private nurseService:NurseService,
    private adminService:AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Configuración de rango de fechas para la fecha de nacimiento
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;

    this.route.params.subscribe((params) => {
      this.doctorID = +params['id'];
      this.doctorService.getDoctorData(this.doctorID).subscribe((data) => {
        this.doctor = data[0];
        this.doctor.birthDate = new Date(this.doctor.birthDate)

        this.profileForm.patchValue({
          ...this.doctor,
          birth: this.doctor.birthDate.toISOString().split('T')[0],
          speciality: this.doctor.worktype + " - " + this.doctor.speciality

        });
      });
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadHospitalsData(); // Llama al método para cargar hospitales
    this.loadWorkerData(); // Carga los datos del trabajador si está en modo de edición
    this.updateFormTitle();

  }


  private initForm(): void {
    this.workerForm = this.fb.group({
      id: [{value: '0', disabled: true }, Validators.required],
      workerCode: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], [AsyncValidatorsW.checkDni(this.workerService, this.workerCode)]],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', Validators.email],
      cip: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      country: ['', Validators.required],
      address: [''],
      gender: ['', Validators.required],
      hospital: ['', Validators.required],
      worktype: ['', Validators.required],
      speciality: ['', []],
      doctorCode: [{value: '',disabled: true}],
      nurseCode: [{value: '',disabled: true}],
      AdminCode: [{value: '',disabled: true}]


    });
  }

  generateWorkerCode(): void {
    const randomCode = Math.floor(1000 + Math.random() * 9000); // Genera un número entre 1000 y 9999
    this.workerForm.get('workerCode')?.setValue(randomCode);
}

  generateCip(): void {
    const name = this.workerForm.get('name')?.value || '';
    const surname1 = this.workerForm.get('surname1')?.value || '';

    const birthDate = this.workerForm.get('birthDate')?.value
      ? new Date(this.workerForm.get('birthDate')?.value).toISOString().split('T')[0]
      : '';
    const cip = `${name.charAt(0).toUpperCase()}${surname1.charAt(0).toUpperCase()}${birthDate.replace(/-/g, '')}`;
    this.workerForm.get('cip')?.setValue(cip);
  }


  generateUsername(): void {
    const name = this.workerForm.get('name')?.value || '';
    const surname = this.workerForm.get('surname1')?.value || '';


    // Tomar las dos primeras letras de cada campo, si están presentes
    const namePart = name.slice(0, 4).toLowerCase();
    const surnamePart = surname.slice(0, 2).toLowerCase();
    const hospitalPart = this.workerForm.get('hospital')?.value || '';

    const username = `${namePart}.${surnamePart}.${hospitalPart}`;
    this.workerForm.get('username')?.setValue(username);
  }




  private loadHospitalsData(): void {
    this.hospitalService.getHospitals().subscribe(
      (hospitals) => {
        this.hospitals = hospitals.filter(hospital => hospital.hospitalCode !== 0);
        console.log(this.hospitals); // Muestra la lista de hospitales en la consola
      },
      (error) => {
        console.error('Error al cargar hospitales:', error);
      }
    );
  }

  private loadWorkerData(): void {
    // Cargar los datos del trabajador si es un trabajador existente (modo edición)
    if (this.isEditMode) {
      // Aquí deberías cargar los datos del trabajador, incluidas las variables como `this.id`, `this.workerForm`, etc.
      this.id = 1;  // Ejemplo: el ID del trabajador que se está editando
    }
  }

  createWorker(): void {
    if (this.workerForm.invalid) {
      console.error('El formulario tiene errores.');
      return;
    }

    // Genera valores faltantes
    if (!this.workerForm.get('workerCode')?.value) {
      this.generateWorkerCode();
    }

    if (!this.workerForm.get('cip')?.value) {
      this.generateCip();
    }
    if (!this.workerForm.get('username')?.value) {
      this.generateUsername();

    }
    this.isEditable = false;
    // Obtén todos los datos del formulario, incluidos valores deshabilitados
    const workerData: WorkerInterface = this.workerForm.getRawValue();



    const worktype = this.workerForm.get('worktype')?.value;

    console.log('Tipo de trabajo:', worktype);
    console.log('Datos enviados al servicio:', workerData);

    if (worktype === 'doctor') {
      // Crear doctor con el mismo código que el workerCode
      const doctorData: DoctorInterface = {
        ...workerData,
        doctorCode: workerData.workerCode, // Asignar el mismo código
        speciality:  this.workerForm.get('speciality')?.value,
      };

      this.doctorService.createDoctor(doctorData).subscribe({
        next: (createdDoctor) => {
          console.log('Doctor creado con éxito:', createdDoctor);
          this.confirm('Doctor creado', 'success');
          this.workerForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el doctor:', error);
          this.confirm('Error al crear el doctor', 'error');
        },
      });
       } else if (worktype === 'nurse') {
        // Crear nurse con el mismo código que el workerCode
        const nurseData: NurseInterface = {
          ...workerData,
          nurseCode: workerData.workerCode, // Asignar el mismo código
          speciality: this.workerForm.get('speciality')?.value, // Ejemplo de propiedad adicional
        };

        this.nurseService.createNurse(nurseData).subscribe({
          next: (createdNurse) => {
            console.log('Enfermero creado con éxito:', createdNurse);
            this.confirm('Enfermero creado', 'success');
            this.workerForm.reset();
          },
          error: (error) => {
            console.error('Error al crear el enfermero:', error);
            this.confirm('Error al crear el enfermero', 'error');
          },
        });
    } else if (worktype === 'administrator') {
      // Crear administrador con el mismo código que el workerCode
      const administratorData: Administrator = {
        ...workerData,
      AdminCode: workerData.workerCode, // Asignar el mismo código

      };

      this.adminService.createAdmin(administratorData).subscribe({
        next: (createdAdministrator) => {
          console.log('Administrador creado con éxito:', createdAdministrator);
          this.confirm('Administrador creado', 'success');
          this.workerForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el administrador:', error);
          this.confirm('Error al crear el administrador', 'error');
        },
      });
    } else {
      // Crear solo el worker
      this.workerService.createWorker(workerData).subscribe({
        next: (createdWorker) => {
          console.log('Trabajador creado con éxito:', createdWorker);
          this.confirm('Trabajador creado', 'success');
          this.workerForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el trabajador:', error);
          this.confirm('Error al crear el trabajador', 'error');
        },
      });
    }}





  toggleEditMode(): void {
    this.isEditable = !this.isEditable;
    this.updateFormTitle();
    this.setFormFields();
  }
  /** Cambia el titulo visible segun el modo */
  private updateFormTitle(): void {
    if (this.isEditMode) {
      this.formTitle = this.isEditable ? 'Editar Trabajador' : 'Perfil Trabajador';
    } else {
      this.formTitle = 'Crear Paciente';
    }
  }
  private setFormFields(): void {
    if (this.isEditable) {
      this.workerForm.enable();
      this.workerForm.get('workerCode')?.disable();
    } else {
      this.workerForm.disable();
      this.workerForm.get('workerCode')?.disable();
    }
  }

  resetForm(): void {
    const currentWorkerCode = this.workerForm.get('id')?.value;
    this.workerForm.reset(); // Resetea el formulario
    this.workerForm.patchValue({workerCode : currentWorkerCode});

  }
  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
  getFilteredSpecialities(): Speciality[] {
    const workType = this.workerForm.get('worktype')?.value;

    // Filtra las especialidades según el tipo de trabajador
    return specialities.filter(speciality => speciality.workerType === workType);
  }


  onSubmit() {
    if(this.profileForm.invalid) return;

    console.log('Perfil actualizado');
    this.confirm('Cambios guardados correctamente', 'success');;
  }

}
