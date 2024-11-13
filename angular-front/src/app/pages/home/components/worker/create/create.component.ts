import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from '../../../../../store/country-data.store'; 
@Component({
  selector: 'app-create-worker',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateWorkerComponent implements OnInit {
  // Propiedad que indica si estamos en modo edición o creación
  isEditMode: boolean = false;

  // Formulario reactivo
  workerForm: FormGroup;

  // Propiedad para almacenar los países
  countries = countries; // Asignamos los países importados a la propiedad `countries`

  // Constructor para inyectar el FormBuilder
  constructor(private fb: FormBuilder) {
    // Inicializar el formulario con validaciones
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
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Puedes controlar el valor de isEditMode según tus necesidades,
    // por ejemplo, verificar si el trabajador ya existe o si se está creando un nuevo trabajador.
    // Si tienes una lógica para editar, puedes establecerlo en true.
    this.isEditMode = false; // Establece a 'false' si es un formulario de creación
  }

  // Método para crear un trabajador
  createWorker(): void {
    if (this.workerForm.valid) {
      // Aquí manejas la lógica para crear el trabajador
      console.log('Creando trabajador:', this.workerForm.value);
    }
  }

  // Método para reiniciar el formulario
  resetForm(): void {
    this.workerForm.reset();
  }
}
