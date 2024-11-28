import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../../interfaces/appointment.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  appointments: AppointmentInterface[] = [];
  filteredAppointments: AppointmentInterface[] = [];
  allFilteredAppointments: AppointmentInterface[] = [];

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
    private spinnerService: SpinnerService
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
  }

  loadAppointmentsData(): void {
    this.appointmentService.getAppointmentData().subscribe({
      next: (data) => {
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
    this.totalPages = Math.ceil(filteredAppointments.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.updatePagedAppointments();
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

  onSubmit() {
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
}
