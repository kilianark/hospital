import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../../services/patient.service';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { DiagnosticTest } from '../../../../../interfaces/diagnostic-test.interface';
import { diagnosticTests } from '../../../../../store/diagnostic-test.store';

@Component({
  selector: 'app-medical-episode',
  templateUrl: './medical-episode.component.html',
  styleUrls: ['./medical-episode.component.css']
})
export class MedicalEpisodeComponent implements OnInit {
public DiagnosticTest = diagnosticTests;
loadPatientHistory() {
this.isHistoryVisible=true;
}
  title = 'Enviar a prueba diagnóstica:';
  patientId!: number;
  patient!: PatientInterface | null;
  testForm: FormGroup;

  isSubmitting = false;
  error: string | null = null;
isHistoryVisible: any;
patientHistory: any;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,

  ) {
    this.testForm = this.formBuilder.group({
      testType: ['', Validators.required],
      testReason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patientId = +params['id'];
      this.loadPatientData();
    });
  }

  loadPatientData(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data) => (this.patient = data),
      error: () => (this.error = 'Error al cargar los datos del paciente.')
    });
  }

  onSubmit(): void {
    if (this.testForm.invalid) return;
    this.isSubmitting = true;
    this.error = null;

    const testData = this.testForm.value;
    const testRequest = {
      patientId: this.patient?.id,
      testType: testData.testType,
      testReason: testData.testReason
    };

    this.patientService.submitTestRequest(testRequest).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/success']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.confirm('Error al enviar el formulario','error');
      }
    });
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
