import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../../interfaces/appointment.interface';
import { PatientService } from '../../../../../../services/patient.service';
import { DoctorService } from '../../../../../../services/doctor.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';
import { PatientInterface } from '../../../../../../interfaces/patient.interface';
import { DoctorInterface } from '../../../../../../interfaces/doctor.interface';
import { identity } from 'rxjs';
import { IdToStringPipe } from '../../../../../../pipe/id-to-string.pipe';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class ManageComponent implements OnInit {
  appointments: AppointmentInterface[] = [];
  filteredAppointments: AppointmentInterface[] = [];
  allFilteredAppointments: AppointmentInterface[] = [];
  patients: PatientInterface[] = [];
  doctors: DoctorInterface[] = [];


  selectedAppointment: AppointmentInterface | null = null; // Cita seleccionada para editar
  isEditModalOpen: boolean = false; // Estado del modal de edición
  editForm: FormGroup; // Formulario para editar citas

  fusePatientName: Fuse<AppointmentInterface> | null = null;
  fuseDoctorName: Fuse<AppointmentInterface> | null = null;

  isLoading = false;

  pageNumbers: number[] = [];
  sortField: string = 'date';
  sortDirection: SortDirection = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  manageForm: FormGroup;

  isVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private appointmentService: AppointmentService,
    private spinnerService: SpinnerService,
    private patientService: PatientService,
    private doctorService: DoctorService,
  ) {
    this.manageForm = this.formBuilder.group({
      patientName: [''],
      doctorName: [''],
      date: [''],
      reason: [''],
    });
    this.editForm = this.formBuilder.group({
      appointmentDate: ['', [Validators.required, futureDateValidator()]],
      appointmentTime: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadAppointmentsData();
    this.loadDoctorData();
    this.loadPatientsData();
  }

  loadPatientsData(): void {
    this.patientService.getPatientData().subscribe({
      next: (data) => {
        this.patients = data;
      }
    });
  }

  loadDoctorData(): void {
    this.doctorService.getDoctorData().subscribe({
      next: (data) => {
        this.doctors = data;
      }
    });
  }

  loadAppointmentsData(): void {
    this.appointmentService.getAppointmentData().subscribe({
      next: (data) => {
        console.log('Citas cargadas:', data);
        this.appointments = data;
        this.filteredAppointments = [...data];
        this.allFilteredAppointments = [...data];

        this.fusePatientName = new Fuse(this.appointments, {
          keys: ['patientName'],
          threshold: 0.3,
        });

        this.fuseDoctorName = new Fuse(this.appointments, {
          keys: ['doctorName'],
          threshold: 0.3,
        });

        this.totalPages = Math.max(1, Math.ceil(this.appointments.length / this.itemsPerPage));
        this.generatePageNumbers();
        this.updatePagedAppointments();
        this.isVisible = true;
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
        this.isVisible = true;
      }
    });
  }

  generatePageNumbers() {
    if (this.totalPages <= 0) {
      this.pageNumbers = [];
      return;
    }

    const totalVisiblePages = 3;
    const halfRange = Math.floor(totalVisiblePages / 2);

    let startPage = Math.max(2, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange);

    if (this.currentPage <= halfRange) {
      endPage = Math.min(this.totalPages - 1, totalVisiblePages);
    }

    if (this.currentPage + halfRange >= this.totalPages) {
      startPage = Math.max(2, this.totalPages - totalVisiblePages + 1);
    }

    this.pageNumbers = [];
    this.pageNumbers.push(1);

    if (startPage > 2) {
      this.pageNumbers.push(-1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }

    if (endPage < this.totalPages - 1) {
      this.pageNumbers.push(-1);
    }

    this.pageNumbers.push(this.totalPages);
  }

  updatePagedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredAppointments = this.allFilteredAppointments.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedAppointments();
      this.generatePageNumbers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedAppointments();
      this.generatePageNumbers();
    }
  }

  sortData(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortAppointments();
  }

  sortAppointments() {
    this.allFilteredAppointments.sort((a, b) => {
      let comparison = 0;

      if (typeof a[this.sortField] === 'string') {
        comparison = a[this.sortField].localeCompare(b[this.sortField]);
      } else {
        comparison = a[this.sortField] - b[this.sortField];
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.updatePagedAppointments();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedAppointments();
  }

  searchAppointments() {
    const { patientName, doctorName, date, reason } = this.manageForm.value;

    let filteredAppointments = [...this.appointments];

    if (patientName && this.fusePatientName) {
      const results = this.fusePatientName.search(patientName).map(result => result.item);
      filteredAppointments = filteredAppointments.filter(appointment => results.includes(appointment));
    }

    if (doctorName && this.fuseDoctorName) {
      const results = this.fuseDoctorName.search(doctorName).map(result => result.item);
      filteredAppointments = filteredAppointments.filter(appointment => results.includes(appointment));
    }

    if (date) {
      filteredAppointments = filteredAppointments.filter(appointment =>
        appointment.appointmentDate === date
      );
    }

    if (reason) {
      filteredAppointments = filteredAppointments.filter(appointment =>
        appointment.reason.toLowerCase().includes(reason.toLowerCase())
      );
    }

    this.allFilteredAppointments = filteredAppointments;
    console.log('Citas filtradas:', this.allFilteredAppointments);
    this.totalPages = Math.max(1, Math.ceil(filteredAppointments.length / this.itemsPerPage));
    this.generatePageNumbers();
    this.updatePagedAppointments();
    this.isVisible = true;
  }

  openDialog(appointmentId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { id: appointmentId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointmentsData();
      }
    });
  }

    deleteappointment(appointment: AppointmentInterface) {
      // Abrimos el diálogo de confirmación para eliminar la cita
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar Cita',
          message: `¿Estás seguro de que deseas eliminar esta cita?`
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // El usuario confirmó la eliminación
          this.appointmentService.deleteAppointment(appointment.id).subscribe({
            next: () => {
              // Si la cita se elimina con éxito, mostramos el mensaje de confirmación
              this.confirm('Cita eliminada con éxito', 'success', appointment.id);
              // Recargamos los datos de las citas
              this.loadAppointmentsData();
            },
            error: (err) => {
              // Si ocurre un error en la eliminación, lo mostramos en la consola
              console.error('Error al eliminar cita:', err);
              this.confirm('Error al eliminar la cita', 'error');
            }
          });
        } else {
          // El usuario canceló la eliminación
          console.log('Eliminación cancelada.');
        }
      });
    }

  onsubmit(appointmentData : any) {
    const appointment: AppointmentInterface = {
      ...appointmentData,
      inUrgencies: false,
    };
    this.spinnerService.show();
    this.isLoading = true;
    this.searchAppointments();
    setTimeout(() => {
      this.spinnerService.hide();
      this.isLoading = false;
    }, 0);
  }

  resetForm() {
    this.manageForm.reset();
    this.isVisible = false;
    this.loadAppointmentsData();
  }

  openEditModal(appointment: AppointmentInterface): void {
    this.selectedAppointment = appointment;


    const appointmentDate = new Date(this.selectedAppointment.appointmentDate);
    const appointmentUTC = new Date(Date.UTC(
      appointmentDate.getFullYear(), 
      appointmentDate.getMonth(), 
      appointmentDate.getDate(), 
      appointmentDate.getHours(), 
      appointmentDate.getMinutes(),
      appointmentDate.getSeconds()));


    const formattedDate = appointmentUTC.toISOString().split('T')[0];
    console.log(formattedDate);
    const dateHours = appointmentUTC.getUTCHours();
    const dateMinutes = appointmentUTC.getUTCMinutes();
    const dateTimeFormat = this.formatDateHours(dateHours, dateMinutes)

    this.editForm.patchValue({
      appointmentDate: formattedDate,
      appointmentTime: dateTimeFormat
    });


    this.isEditModalOpen = true;
  }


  saveEditedAppointment(): void {
    const appointmentDate = new Date(this.editForm.value.appointmentDate);
    const appointmentDateUTC = new Date(Date.UTC(
      appointmentDate.getFullYear(), 
      appointmentDate.getMonth(), 
      appointmentDate.getDate(), 
      this.editForm.value.appointmentTime.split(":")[0],
      this.editForm.value.appointmentTime.split(":")[1]
    ));

    const today = new Date();


    if (appointmentDateUTC < today) {
      this.confirm('La fecha de la cita no puede ser anterior al día actual', 'warning');
      return;
    }
    if (this.editForm.invalid || !this.selectedAppointment) return;

    const updatedAppointment = {
      ...this.selectedAppointment,
      appointmentDate: appointmentDateUTC
    };

    this.appointmentService.updateAppointment(updatedAppointment.id, updatedAppointment).subscribe({
      next: () => {
        this.confirm('Cita actualizada con éxito', 'success');
        console.log('Cita actualizada:', updatedAppointment);
        this.isEditModalOpen = false;
        this.loadAppointmentsData();
      },
      error: (err) => {
        this.confirm('Erro al actualizar cita', 'error');
        console.error('Error al actualizar cita:', err);
      },
    });
  }

  cancelEdit(): void {
    this.isEditModalOpen = false;
    this.selectedAppointment = null;
    this.editForm.reset();
  }


  confirm(message: string, type: string, appointmentId: number = null) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { idObjectEliminated: appointmentId, type: 'appointment' }
    });

    dialogRef.componentInstance.setMessage(message, type);
    dialogRef.afterClosed().subscribe(undo => {
      if (undo) {
        this.loadAppointmentsData();
      }
    });
  }

  formatDateHours(hours: number, minutes: number) : string {
    var hoursString = hours >= 10 ? hours.toString() : "0" + hours.toString();
    var minutesString = minutes >= 10 ? minutes.toString(): "0" + minutes.toString();
    return hoursString + ":" + minutesString
  }
}
