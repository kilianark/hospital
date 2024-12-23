import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { HospitalService } from '../../../../../services/hospital.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from '../../../../../directives/has-role.directive';
import { SpinnerService } from '../../../../../services/spinner.service';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { SignalRService } from '../../../../../services/signal-r.service';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patients: PatientInterface[] = [];
  filteredPatients: PatientInterface[] = [];
  allFilteredPatients: PatientInterface[] = [];

  fuseName: Fuse<PatientInterface> | null = null;
  fuseSurname1: Fuse<PatientInterface> | null = null;
  fuseSurname2: Fuse<PatientInterface> | null = null;

  isLoading = false;

  pageNumbers: number[] = [];
  sortField: string = 'name';
  sortDirection: SortDirection = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  patientForm: FormGroup;

  patientCode: string = '';
  name: string = '';
  surname1: string = '';
  surname2: string = '';
  dni: string = '';
  cip: string = '';
  phone: string = '';
  status: string = '';
  bedId: number = 0;
  hospital: number = 0;

  isVisible: boolean = false;//barra
  showSelect: boolean = false;

  hospitals: HospitalInterface[] = [];

  patientStatus = Object.keys(HospitalZone)
    .filter(
      (key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone]))
    )
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private patientService: PatientService,
    private hospitalService: HospitalService,
    private translator: TranslateService,
    private spinnerService: SpinnerService,
    private signalRService: SignalRService
  ) {

    this.translator.use('es');

    this.patientForm = this.formBuilder.group({
      hospital: [[], { nonNullable: true }], //esto permite selección múltiple
      status: [null],
      patientCode: [this.patientCode],
      name: [this.name],
      surname1: [this.surname1],
      surname2: [this.surname2],
      dni: [this.dni],
      cip: [this.cip],
      phone: [this.phone],
    });

    this.patientForm.valueChanges.subscribe((formValues) => {
      this.hospital = formValues.hospital;
      this.patientCode = formValues.patientCode;
      this.name = formValues.name;
      this.surname1 = formValues.surname1;
      this.surname2 = formValues.surname2;
      this.dni = formValues.dni;
      this.cip = formValues.cip;
      this.phone = formValues.phone;
    });
  }

  ngOnInit(): void {

    this.loadHospitalsData();

    this.loadPatientsData();

    this.signalRService.listenForUpdates((tableName) => {
      console.log('entra en signalR');
      if(tableName === 'Patients') {
        console.log('Si entra en if de signalR');
        this.loadPatientsData();
      }
    })

    
  }

  loadPatientsData(): void {
    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data.map(patient => ({
        ...patient,
        status: patient.zone
      }));
      
      console.log(this.patients);

      this.fuseName = new Fuse(this.patients, {
        keys: ['name'],
        threshold: 0.3,
      });

      this.fuseSurname1 = new Fuse(this.patients, {
        keys: ['surname1'],
        threshold: 0.3,
      });

      this.fuseSurname2 = new Fuse(this.patients, {
        keys: ['surname2'],
        threshold: 0.3,
      });

      this.patientService.patientUpdated$.subscribe((updatedPatient: PatientInterface) => {
        this.updatePatientInList(updatedPatient);
      });


      this.searchPatients();
      console.log(this.patients);

    });
  }

  loadHospitalsData(): void {
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
  }

  getHospitalName(hospitalCode: number): string {
    const hospital = this.hospitals.find(h => h.hospitalCode === hospitalCode);
    return hospital ? hospital.hospitalName : 'Desconocido';
  }

  updatePatientInList(updatedPatient: PatientInterface) {
    const index = this.patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patients[index] = updatedPatient;
      this.filteredPatients[index] = updatedPatient;
      this.updatePagedPatients();
    }
  }

  updatePagedPatients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredPatients = this.allFilteredPatients.slice(startIndex, endIndex);
  }

  generatePageNumbers() {

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

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPatients();
      this.generatePageNumbers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedPatients();
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
    this.sortPatients();
  }

  sortPatients() {
    this.allFilteredPatients.sort((a, b) => {
      let comparison = 0;

      if (typeof a[this.sortField] === 'string') {
        comparison = a[this.sortField].localeCompare(b[this.sortField]);
      } else {
        comparison = a[this.sortField] - b[this.sortField];
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.updatePagedPatients();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedPatients();
  }

  searchPatients() {

    this.isVisible = false;

    const name = this.patientForm.get('name')?.value || '';
    const surname1 = this.patientForm.get('surname1')?.value || '';
    const surname2 = this.patientForm.get('surname2')?.value || '';
    const dni = this.patientForm.get('dni')?.value || '';
    const cip = this.patientForm.get('cip')?.value || '';
    const patientCode = this.patientForm.get('patientCode')?.value || '';
    const phone = this.patientForm.get('phone')?.value || '';
    const status = this.patientForm.get('status')?.value || '';
    const selectedHospitals = this.patientForm.get('hospital')?.value.map(Number) || [];

    console.log(selectedHospitals)


    let exactFilteredPatients = this.patients;

    if (dni) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.dni) === dni
      );
    }

    if (cip) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.cip) === cip
      );
    }

    if (phone) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.phone) === phone
      );
    }

    if (patientCode) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.patientCode) === patientCode
      );
    }

    if (status && status !== '') {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.zone) === String(status)
      );
    }

    if (selectedHospitals.length > 0) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        selectedHospitals.includes(patient.hospital)
      );
    }

    let fuzzyFilteredPatients = exactFilteredPatients;

    if (this.fuseName && name) {
      const fuzzyResultsName = this.fuseName.search(name);
      fuzzyFilteredPatients = fuzzyFilteredPatients.filter((patient) =>
        fuzzyResultsName.some((result) => result.item === patient)
      );
    }

    if (this.fuseSurname1 && surname1) {
      const fuzzyResultsSurname1 = this.fuseSurname1.search(surname1);
      fuzzyFilteredPatients = fuzzyFilteredPatients.filter((patient) =>
        fuzzyResultsSurname1.some((result) => result.item === patient)
      );
    }

    if (this.fuseSurname2 && surname2) {
      const fuzzyResultsSurname2 = this.fuseSurname2.search(surname2);
      fuzzyFilteredPatients = fuzzyFilteredPatients.filter((patient) =>
        fuzzyResultsSurname2.some((result) => result.item === patient)
      );
    }

    this.allFilteredPatients = fuzzyFilteredPatients;
    this.totalPages = Math.ceil(this.allFilteredPatients.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.updatePagedPatients();
    this.isVisible = this.allFilteredPatients.length > 0;

  }

  openDialog(patientId: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientId,
    });

    popupRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patientService.getPatientData().subscribe((data) => {
          this.patients = data.map(patient => ({
            ...patient,
            status: patient.zone
          }));
          this.searchPatients();
        });
      }
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  deletePatient(patient: PatientInterface) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Paciente',
        message: `¿Estás seguro de que deseas eliminar al paciente ${patient.name} ${patient.surname1}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // El usuario confirmó, procedemos a eliminar el paciente
        this.patientService.deletePatientData(patient.id).subscribe(() => {
          // Eliminamos el paciente de la lista
          this.patients = this.patients.filter(p => p.id !== patient.id);
          this.searchPatients();
          this.confirm(`Paciente ${patient.name} ${patient.surname1} eliminado.`, 'success', patient);
        }, 
        error => {
          if (error.status == 400) {
            this.confirm(`Error al eliminar paciente, no se puede eliminar paciente con cama assignada.`, 'error');
          } else {
            this.confirm(`Error al eliminar paciente`, 'error');
          }
        });
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  onSubmit() {

    this.spinnerService.show();
    this.isLoading = true;

    this.searchPatients();

    setTimeout(() => {
      this.spinnerService.hide();
      this.isLoading = false;
    }, 0);
  }

  resetForm() {
    this.patientForm.reset();
    this.isVisible = false;
  }

  toggleDisplay() {
    this.isVisible = true;
  }

  confirm(message: string,type:string, patient: PatientInterface = null) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {idObjectEliminated: patient?.id, type: "patient"}
    });
    dialogRef.componentInstance.setMessage(message,type);
    dialogRef.afterClosed().subscribe((undo) => {
      if (undo) {
        this.patients.push(patient);
        this.onSubmit();
      }
    })
  }
}
