import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DoctorService } from '../../../../../../services/doctor.service';
import { PatientService } from '../../../../../../services/patient.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// Validador personalizado para asegurar que la fecha sea futura
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si el campo está vacío, no se genera error aquí.
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? null : { notFutureDate: true };
  };
}

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: { id: number; name: string }[] = []; // Lista de doctores disponibles
  patients: { id: number; name: string }[] = []; // Lista de pacientes

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router
  ) {
    // Crear el formulario con controles necesarios
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required], // Selector para médico
      patientId: ['', Validators.required], // Selector para paciente
      date: ['', [Validators.required, futureDateValidator()]], // Fecha de la cita con validador personalizado
      reason: ['', Validators.maxLength(250)], // Razón de la cita
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

  // Cargar médicos disponibles desde el servicio
  loadDoctors(): void {
    this.doctorService.getDoctorData().subscribe(
      (doctors) => {
        this.doctors = doctors.map((d) => ({ id: d.id, name: `${d.name} ${d.surname1}` }));
      },
      (error) => {
        console.error('Error al cargar los médicos:', error);
      }
    );
  }

  // Cargar pacientes desde el servicio
  loadPatients(): void {
    this.patientService.getPatientData().subscribe(
      (patients) => {
        this.patients = patients.map((p) => ({ id: p.id, name: `${p.name} ${p.surname1} ${p.surname2}` }));
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
      }
    );
  }

  // Manejar la creación del formulario
  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log('Formulario enviado:', this.appointmentForm.value);
      // Aquí puedes llamar a un servicio para guardar la cita
      this.router.navigate(['/appointments']);
    } else {
      console.error('Formulario inválido');
    }
  }
}
