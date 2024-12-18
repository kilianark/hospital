import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../../services/patient.service';
import { AppointmentService } from '../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../interfaces/appointment.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { DiagnosticTest } from '../../../../../interfaces/diagnostic-test.interface';
import { DiagnosticTestService } from '../../../../../services/diagnostic-test.service';

@Component({
  selector: 'app-medical-episode',
  templateUrl: './medical-episode.component.html',
  styleUrls: ['./medical-episode.component.css']
})
export class MedicalEpisodeComponent implements OnInit {
  public availableDiagnosticTests: DiagnosticTest[] = [];
  public availableWorkers: any[] = []; // Trabajadores para la prueba seleccionada

  title = 'Enviar a prueba diagnóstica:';
  patientId!: number;
  patient!: PatientInterface | null;

  isSubmitting = false;
  error: string | null = null;
  testForm: FormGroup;
  isHistoryVisible: boolean = false;
  patientHistory: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private diagnosticTestService: DiagnosticTestService
  ) { }

  ngOnInit() {
    this.testForm = this.formBuilder.group({
      testType: ['', Validators.required],
      testReason: ['', Validators.required],
      workerId: ['', Validators.required] // Campo para seleccionar al doctor/nurse
    });

    // Obtener el ID del paciente de la ruta
    this.route.params.subscribe(params => {
      this.patientId = +params['id']; // El '+' convierte el string a número
      this.loadPatientData();
    });

    this.loadAvailableDiagnosticTests();

    // Actualiza los trabajadores disponibles al cambiar el tipo de prueba
    this.testForm.get('testType')?.valueChanges.subscribe(testCode => {
      this.loadWorkersForTest(testCode);
    });
  }

  loadAvailableDiagnosticTests() {
    this.diagnosticTestService.getAvailableDiagnosticTests().subscribe(
      (tests: DiagnosticTest[]) => {
        this.availableDiagnosticTests = tests;
      },
      (error) => {
        console.error('Error loading available diagnostic tests:', error);
      }
    );
  }

  loadWorkersForTest(testCode: string) {
    this.diagnosticTestService.getWorkersByTestCode(testCode).subscribe(
      (workers) => {
        console.log('Workers for test:', workers);
        this.availableWorkers = workers;
      },
      (error) => {
        console.error('Error loading workers for test:', error);
      }
    );
  }

  loadPatientHistory() {
    this.isHistoryVisible = true;
    this.patientHistory = [
      { date: new Date(), testType: 'Hemograma', reason: 'Control rutinario', result: 'Normal' },
      { date: new Date(), testType: 'Glucosa', reason: 'Sospecha de diabetes', result: 'Pendiente' },
    ];
  }

  loadPatientData(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;
        console.log('Patient data loaded:', this.patient);
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del paciente.';
        console.error('Error loading patient data:', err);
      }
    });
  }

  sendToUrgentAppointment() {
    if (!this.patient) {
      this.confirm('No se encontró información del paciente', 'error');
      return;
    }

    // Obtener el ID del doctor/nurse seleccionado del formulario
    const selectedDoctorId = this.testForm.get('workerId')?.value;

    // Validar que el doctor/nurse esté seleccionado
    if (!selectedDoctorId) {
      this.confirm('Debe seleccionar un doctor/nurse para la prueba.', 'error');
      return;
    }

    // Crear una fecha y hora para la cita urgente (2 horas después de la hora actual)
    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 2);

    // Crear el objeto de cita conforme a la interfaz
    const appointment: AppointmentInterface = {
      id: 0, // Se puede usar 0 o un valor temporal; el backend puede sobrescribirlo
      patientId: this.patient.id,
      doctorId: selectedDoctorId,
      appointmentDate: appointmentDate, // Debe ser de tipo Date
      status: 'pending', // Estado inicial de la cita
      reason: this.testForm.get('testReason')?.value || '', // Motivo proporcionado en el formulario
      inUrgencies: true // Indica que es una cita de urgencia
    };

    // Llamar al servicio para crear la cita
    this.appointmentService.createAppointment(appointment).subscribe(
      (response) => {
        console.log('Cita urgente creada:', response);
        this.confirm('Cita urgente creada con éxito', 'success');
      },
      (error) => {
        console.error('Error al crear la cita urgente:', error);
        this.confirm('Error al crear la cita urgente', 'error');
      }
    );
  }


  transferToTests(patient: PatientInterface): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Enviar a pruebas diagnósticas',
        message: `¿Estás seguro de que deseas enviar al paciente ${patient.name} ${patient.surname1} a pruebas diagnósticas?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testForm.patchValue({ patientId: patient.id });
      }
    });
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }

  getGenderLabel(gender: string): string {
    return gender === 'male' ? 'Hombre' : gender === 'female' ? 'Mujer' : 'Otro';
  }

  calculateAge(birthDate: string | Date): number {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }
}
