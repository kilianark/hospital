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
  sortField: string = 'name'; // Campo por defecto para ordenar
  sortDirection: SortDirection = 'asc'; // Dirección de orden por defecto
  // Variables para la paginación
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

  isVisible: boolean = false;
  showSelect: boolean = false;

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

    });
    /*
    (error) => {
      console.error('Error al buscar pacientes:', error);
      this.isLoading = false; // Finaliza el estado de carga incluso en caso de error
      this.isVisible = false; // No muestra los resultados si ocurre un error
    });*/
  }

  updatePagedPatients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredPatients = this.allFilteredPatients.slice(startIndex, endIndex);
  }
  // Generar los números de página
  generatePageNumbers() {

    const totalVisiblePages = 3; // Número máximo de páginas visibles
    const halfRange = Math.floor(totalVisiblePages / 2);

    let startPage = Math.max(2, this.currentPage - halfRange); // Empieza desde la página 2
    let endPage = Math.min(this.totalPages - 1, this.currentPage + halfRange); // Termina en la penúltima página

    // Ajustar el rango si está cerca del principio o del final
    if (this.currentPage <= halfRange) {
      endPage = Math.min(this.totalPages - 1, totalVisiblePages);
    }
    if (this.currentPage + halfRange >= this.totalPages) {
      startPage = Math.max(2, this.totalPages - totalVisiblePages + 1);
    }

    // Generar los números de página, siempre incluyendo la primera y la última página
    this.pageNumbers = [];

    this.pageNumbers.push(1); // Siempre muestra la primera página

    // Agregar '...' si hay un salto entre la primera página y el inicio del rango
    if (startPage > 2) {
      this.pageNumbers.push(-1); // Indica un salto
    }

    // Páginas cercanas a la actual
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }

    // Agregar '...' si hay un salto entre el final del rango y la penúltima página
    if (endPage < this.totalPages - 1) {
      this.pageNumbers.push(-1); // Indica un salto
    }

    this.pageNumbers.push(this.totalPages); // Siempre muestra la última página
  }
  // Cambiar a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPatients(); // Actualizar los pacientes visibles
      this.generatePageNumbers(); // Actualizar los números de página
    }
  }

  // Cambiar a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedPatients(); // Actualizar los pacientes visibles
      this.generatePageNumbers(); // Actualizar los números de página
    }
  }
  sortData(field: string) {
    if (this.sortField === field) {
      // Cambiar la dirección de orden si ya está ordenando por ese campo
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es un nuevo campo, lo ordenamos ascendentemente por defecto
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    // Ahora actualizamos el arreglo de pacientes ordenado
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

    // Después de ordenar, actualizamos los pacientes paginados
    this.updatePagedPatients();
  }

  // Cambiar a una página específica
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedPatients();
  }


  searchPatients() {
    //campos fuzzy
    const name = this.patientForm.get('name')?.value || '';
    const surname1 = this.patientForm.get('surname1')?.value || '';
    const surname2 = this.patientForm.get('surname2')?.value || '';

    //campos búsqueda exacta:
    const dni = this.patientForm.get('dni')?.value || '';
    const cip = this.patientForm.get('cip')?.value || '';
    const patientCode = this.patientForm.get('patientCode')?.value || '';
    const phone = this.patientForm.get('phone')?.value || '';
    const status = this.patientForm.get('status')?.value || '';

    let exactFilteredPatients = this.patients;

    if (dni) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.dni) === (dni));
    }

    if (cip) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.cip) === (cip));
    }

    if (phone) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.phone) === (phone));
    }

    if (patientCode) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.patientCode) === patientCode);
    }

    if (status && status !== '') {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.zone) === String(status));
    }

    let fuzzyFilteredPatients = exactFilteredPatients;

    //campos búsqueda fuzzy:

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
    this.isVisible = this.allFilteredPatients.length > 0;

    this.currentPage = 1; // Reinicia la página actual al buscar
    this.totalPages = Math.ceil(this.allFilteredPatients.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.updatePagedPatients();

    this.isLoading = false;
  }

  openDialog(patientId: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientId,
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  onSubmit() {
    this.isLoading = true; // Comienza el estado de carga
    this.isVisible = false; // Oculta los resultados anteriores
    this.searchPatients();
  }

  resetForm() {
    this.patientForm.reset();
    this.isVisible = false;
  }

  toggleDisplay() {
    this.isVisible = true;
  }
}
