import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService } from '../../../../../services/worker.service';
import { HospitalService } from '../../../../../services/hospital.service';
import { countries } from '../../../../../store/country-data.store';
import { Worker } from '../../../../../interfaces/worker.interface';
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
  hospitals: any[] = []; // Nueva propiedad para almacenar hospitales

  constructor(
    private fb: FormBuilder,
    private workerService: WorkerService,
    private hospitalService: HospitalService, // Inyecta HospitalService
    private router: Router
  ) {
    // Inicia el formulario con los campos correspondientes
    this.workerForm = this.fb.group({
      name: ['', Validators.required],
      surname1: ['', Validators.required],
      surname2: [''],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      birthDate: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      worktype: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      hospital: ['', Validators.required]  // Campo para seleccionar el hospital
    });
  }

  ngOnInit(): void {
    // Llama al método para cargar hospitales cuando se inicializa el componente
    this.loadHospitalsData();
  }

  private loadHospitalsData(): void {
    // Llama al servicio para obtener la lista de hospitales
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals.filter(hospital => hospital.hospitalCode !== 0); // Filtra hospitales si es necesario
      console.log(this.hospitals);  // Muestra la lista de hospitales en la consola
    }, (error) => {
      console.error('Error al cargar hospitales:', error);
    });
  }

  createWorker(): void {
    // Verifica que el formulario sea válido antes de enviarlo
    if (this.workerForm.valid) {
      const workerData: Worker = this.workerForm.value;  // Toma los datos del formulario
      this.workerService.createWorker(workerData).subscribe(
        (response) => {
          console.log('Trabajador creado exitosamente:', response);
          this.router.navigate(['/workers']); // Redirige a la lista de trabajadores
        },
        (error) => {
          console.error('Error al crear trabajador:', error); // Muestra errores en la consola
        }
      );
    }
  }

  resetForm(): void {
    this.workerForm.reset(); // Resetea el formulario
  }
}
