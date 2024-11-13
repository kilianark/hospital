import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService } from '../../../../../services/worker.service';
import { HospitalService } from '../../../../../services/hospital.service';
import { countries } from '../../../../../store/country-data.store';
import { Worker } from '../../../../../interfaces/worker.interface';
import { CustomValidators } from '../../../../../validators/CustomValidators';
import { AsyncValidatorsW } from '../../../../../validators/AsyncValidatorW';
import { Router } from '@angular/router';

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
  id?: number;  // Aquí añadimos el campo id, que puede ser undefined al crear un trabajador

  constructor(
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
      id: [{ value: '0', disabled: true }, Validators.required],  // 'id' puede ser 0 para nuevo trabajador
      name: ['', [Validators.required, CustomValidators.notBlank()]],
      surname1: ['', [Validators.required, CustomValidators.notBlank()]],
      surname2: [''],
      dni: ['', [Validators.required, CustomValidators.validDniOrNie()], [AsyncValidatorsW.checkDni(this.workerService, this.id)]],
      birthDate: ['', [Validators.required, CustomValidators.dateRange(this.minDateBirth, this.maxDateBirth)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', Validators.email],
      country: ['', Validators.required],
      address: [''],
      gender: ['', Validators.required],
      hospital: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadHospitalsData(); // Llama al método para cargar hospitales
    this.loadWorkerData(); // Carga los datos del trabajador si está en modo de edición
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
    if (this.workerForm.valid) {
      const workerData: Worker = this.workerForm.value;
      this.workerService.createWorker(workerData).subscribe(
        (response) => {
          console.log('Trabajador creado exitosamente:', response);
          this.router.navigate(['/workers']); // Redirige a la lista de trabajadores
        },
        (error) => {
          console.error('Error al crear trabajador:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.workerForm.reset(); // Resetea el formulario
  }
}
