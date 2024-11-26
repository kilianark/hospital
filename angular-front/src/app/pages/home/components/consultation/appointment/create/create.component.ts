import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { DoctorService } from '../../../../../../services/doctor.service';
import { PatientService } from '../../../../../../services/patient.service';
import { AppointmentService } from '../../../../../../services/appointment.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';
import { AppointmentInterface } from '../../../../../../interfaces/appointment.interface';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

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
  doctors: { id: number; name: string }[] = [];
  patients: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      patientId: ['', Validators.required],
      date: ['', [Validators.required, futureDateValidator()]],
      reason: ['', Validators.maxLength(250)],
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

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

  onFormSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment: AppointmentInterface = this.appointmentForm.value;

      this.appointmentService.createAppointment(appointment).subscribe(
        (response) => {
          console.log('Cita registrada:', response);
          this.confirm('Cita registrada con éxito', 'success');
        },
        (error) => {
          this.confirm('Error al registrar la cita. Inténtalo de nuevo.', 'error');
          console.error('Error al registrar la cita:', error);
        }
      );
    }
  }

  confirm(message: string, type: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
}
