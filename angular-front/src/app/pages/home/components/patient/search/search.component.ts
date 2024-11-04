import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { Hospital } from '../../../../../enums/hospital.enum';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patients: PatientInterface[] = [];
  filteredPatients: PatientInterface[] = [];
  allFilteredPatients: PatientInterface[] = [];

  fuseName: Fuse<PatientInterface> | null = null;
  fuseSurname1: Fuse<PatientInterface> | null = null;
  fuseSurname2: Fuse<PatientInterface> | null = null;

  pageNumbers: number[] = [];
  isLoading = false;
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
  hospital: string [] = []; //Array para selección múltiple

  isVisible: boolean = false;
  showSelect: boolean = false;

  hospitals = Object.keys(Hospital).map(key => ({
    value: key,
    hospitalName: Hospital[key as keyof typeof Hospital]
  }));


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
    private translator: TranslateService
  ) {
    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.patientForm = this.formBuilder.group({
      hospital: [[]], //esto permite selección múltiple
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

    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data.map(patient => ({
        ...patient,
        status: patient.zone
      }));

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
      })
    });
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
      const selectedHospitals: string[] = this.patientForm.get('hospital')?.value.map(hospital => hospital.value) || [];

    
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
      console.log('Hospitals selected:', this.patientForm.get('hospital')?.value);
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

  onSubmit() {
    this.isLoading = true;
    this.searchPatients();
    
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }

  resetForm() {
    this.patientForm.reset();
    this.isVisible = false;
  }

  toggleDisplay() {
    this.isVisible = true;
  }
}
