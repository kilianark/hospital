import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService } from '../../../../../services/worker.service';
import { HospitalService } from '../../../../../services/hospital.service';
import { countries } from '../../../../../store/country-data.store';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { CustomValidators } from '../../../../../validators/CustomValidators';
import { AsyncValidatorsW } from '../../../../../validators/AsyncValidatorsW';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-worker',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateWorkerComponent implements OnInit {
  isEditMode: boolean = false;
  workerForm: FormGroup;
  countries = countries;
  hospitals: any[] = [];
  minDateBirth: Date;
  maxDateBirth: Date;
  id?: number;
  workerCode: string;
  lastId: number = 0;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private workerService: WorkerService,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    // Configuración de rango de fechas para la fecha de nacimiento
    const today = new Date();
    this.minDateBirth = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    this.maxDateBirth = today;

    // Inicialización del formulario
    this.workerForm = this.fb.group({
      id: [null],
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
    });
  }

  ngOnInit(): void {
    this.loadHospitalsData(); // Llama al método para cargar hospitales
    this.loadWorkerData(); // Carga los datos del trabajador si está en modo de edición


  }

  generateWorkerCode(): void {
    const code = `W${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    this.workerForm.get('workerCode')?.setValue(code);
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
    const username = `${name.toLowerCase()}.${surname.toLowerCase()}`;
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

    // Obtén todos los datos del formulario, incluidos valores deshabilitados
    const workerData: WorkerInterface = this.workerForm.getRawValue();

    // Elimina el campo 'id' si no es necesario
    if (!workerData.id) {
      workerData.id = null;
    }

    console.log('Datos enviados al servicio:', workerData);

    // Llama al servicio para crear el trabajador
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
  }





  resetForm(): void {
    this.workerForm.reset(); // Resetea el formulario
  }
  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
  getSpecialities(): string[] {
    const worktype = this.workerForm.get('worktype')?.value;
    if (worktype === 'doctor') {
      return ['Cardiología', 'Neurología', 'Pediatría'];
    } else if (worktype === 'nurse') {
      return ['Cuidados Intensivos', 'Pediatría', 'Geriatría'];
    }
    return [];
  }

}
