import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../../interfaces/appointment.interface';
import { PatientService } from '../../../../../../services/patient.service';
import { DoctorService } from '../../../../../../services/doctor.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';
import { PatientInterface } from '../../../../../../interfaces/patient.interface';
import { DoctorInterface } from '../../../../../../interfaces/doctor.interface';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  appointments: AppointmentInterface[] = [];
  filteredAppointments: AppointmentInterface[] = [];
  allFilteredAppointments: AppointmentInterface[] = [];
  patients: PatientInterface[] = [];
  doctors: DoctorInterface[] = [];

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

  // Inyecta los servicios
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
  }

  ngOnInit(): void {
    this.loadAppointmentsData();
    this.loadDoctorData();
    this.loadPatientsData();
  }

  // Método para cargar las citas
  loadPatientsData(): void {
    this.patientService.getPatientData().subscribe({
      next: (data) => {
        this.patients = data;
      }
    })
  }

  loadDoctorData(): void {
    this.doctorService.getDoctorData().subscribe({
      next: (data) => {
        this.doctors = data;
      }
    })
  }
  loadAppointmentsData(): void {
    this.appointmentService.getAppointmentData().subscribe({
      next: (data) => {
        console.log('Citas cargadas:', data);  // Verifica en la consola que las citas se cargan correctamente
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

        this.totalPages = Math.ceil(this.appointments.length / this.itemsPerPage);
        this.generatePageNumbers();
        this.updatePagedAppointments();
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
      }
    });
  }

  // Método para generar los números de página
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
      this.pageNumbers.push(-1); // Indicador de omisión
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }

    if (endPage < this.totalPages - 1) {
      this.pageNumbers.push(-1); // Indicador de omisión
    }

    this.pageNumbers.push(this.totalPages);
  }

  // Método para actualizar las citas según la página actual
  updatePagedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredAppointments = this.allFilteredAppointments.slice(startIndex, endIndex);
  }

  // Método para ir a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedAppointments();
      this.generatePageNumbers();
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedAppointments();
      this.generatePageNumbers();
    }
  }

  // Método para ordenar las citas
  sortData(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortAppointments();
  }

  // Método para ordenar las citas
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

  // Método para ir a una página específica
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedAppointments();
  }

  // Método de búsqueda de citas
  searchAppointments() {
    const { patientName, doctorName, date, reason } = this.manageForm.value;

    let filteredAppointments = [...this.appointments];

    if (patientName && this.fusePatientName) {
      filteredAppointments = this.fusePatientName.search(patientName).map(result => result.item);
    }

    if (doctorName && this.fuseDoctorName) {
      filteredAppointments = this.fuseDoctorName.search(doctorName).map(result => result.item);
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
    console.log('Citas filtradas:', this.allFilteredAppointments); // Verifica el contenido de las citas filtradas
    this.totalPages = Math.ceil(filteredAppointments.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.updatePagedAppointments();
  }
  // Método para abrir el diálogo de confirmación
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

  // Método al enviar el formulario de búsqueda
  onSubmit() {
    this.spinnerService.show();
    this.isLoading = true;
    this.searchAppointments();
    setTimeout(() => {
      this.spinnerService.hide();
      this.isLoading = false;
    }, 0);
  }

  // Método para resetear el formulario de búsqueda
  resetForm() {
    this.manageForm.reset();
    this.isVisible = false;
    this.loadAppointmentsData();
  }

  // Método para confirmar la eliminación de una cita
  confirm(message: string, type: string, appointmentId: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { idObjectEliminated: appointmentId, type: 'appointment' }
    });

    dialogRef.componentInstance.setMessage(message, type);
    dialogRef.afterClosed().subscribe(undo => {
      if (undo) {
        this.loadAppointmentsData();
        this.onSubmit();
      }
    });
  }

// Método para obtener el nombre del paciente por su ID
}
