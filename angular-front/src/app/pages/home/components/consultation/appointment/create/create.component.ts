import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { DoctorService } from '../../../../../../services/doctor.service';
import { PatientService } from '../../../../../../services/patient.service';
import { AppointmentService } from '../../../../../../services/appointment.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';
import { AppointmentInterface } from '../../../../../../interfaces/appointment.interface';

// Validador personalizado para verificar que la fecha sea futura
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { notFutureDate: true };
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
      appointmentDate: ['', [Validators.required, futureDateValidator()]], // Valida que la fecha sea futura
      appointmentTime: ['', Validators.required], // Campo para la hora
      reason: ['', Validators.maxLength(250)],
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

  // Cargar la lista de médicos desde el servicio
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

  // Cargar la lista de pacientes desde el servicio
  loadPatients(): void {
    this.patientService.getPatientData().subscribe(
      (patients) => {
        this.patients = patients.map((p) => ({ id: p.id, name: `${p.name} ${p.surname1} ${p.surname2 ? p.surname2 : "" }` }));
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
      }
    );
  }

  // Formatear la fecha
  private formatDate(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  // Manejar el envío del formulario
  onFormSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;

      // Verifica si la fecha y la hora están presentes
      if (!formValue.appointmentDate || !formValue.appointmentTime) {
        console.error('La fecha y hora son obligatorias');
        return;
      }

      // Combina la fecha y hora
      const appointmentDate = new Date(formValue.appointmentDate);
      const [hours, minutes] = formValue.appointmentTime.split(':'); // Extrae la hora y minutos

      // Establece la hora y minutos a la fecha seleccionada
      appointmentDate.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10));

      // Convierte el objeto Date a formato ISO (incluye fecha y hora)
      const formattedAppointmentDate = appointmentDate.toISOString();

      const appointment: AppointmentInterface = {
        ...formValue,
        appointmentDate: formattedAppointmentDate, // Se usa la fecha con hora combinada
      };

      console.log(appointment)

      // Llama al servicio para crear la cita
      this.appointmentService.createAppointment(appointment).subscribe(
        (response) => {
          console.log('Cita registrada:', response);
          this.confirm('Cita registrada con éxito', 'success');
          this.router.navigate(['/home/consultation/']);
        },
        (error) => {
          this.confirm('Error al registrar la cita. Inténtalo de nuevo.', 'error');
          console.error('Error al registrar la cita:', error);
        }
      );
    }
  }

  // Mostrar mensaje de confirmación
  confirm(message: string, type: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
}
