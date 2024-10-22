import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patients: PatientInterface[] = [];
  pagedPatients: PatientInterface[] = []; // Pacientes en la página actual
  pageNumbers: number[] = [];

  isLoading = false;

  sortField: string = 'name'; // Campo por defecto para ordenar
  sortDirection: SortDirection = 'asc'; // Dirección de orden por defecto

  // Variables para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 1;
  totalPages: number = 0;

  patientForm: FormGroup;

  patientCode: string = ''; //comprovar que se puede convertir en numero
  name: string = '';
  surname1: string = '';
  surname2: string = '';
  dni: string = '';
  cip: string = '';
  phone: string = '';
  status: string = '';
  bedId: number = 0;

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
      status: [''],
      patientCode: [this.patientCode],
      name: [this.name],
      surname1: [this.surname1],
      surname2: [this.surname2],
      dni: [this.dni],
      cip: [this.cip],
      phone: [this.phone],
    });

    this.patientForm.get('patientCode')?.valueChanges.subscribe((value) => {
      this.patientCode = value;
    });

    this.patientForm.get('name')?.valueChanges.subscribe((value) => {
      this.name = value;
    });

    this.patientForm.get('surname1')?.valueChanges.subscribe((value) => {
      this.surname1 = value;
    });

    this.patientForm.get('surname2')?.valueChanges.subscribe((value) => {
      this.surname2 = value;
    });

    this.patientForm.get('dni')?.valueChanges.subscribe((value) => {
      this.dni = value;
    });

    this.patientForm.get('cip')?.valueChanges.subscribe((value) => {
      this.cip = value;
    });

    this.patientForm.get('phone')?.valueChanges.subscribe((value) => {
      this.phone = value;
    });
  }

  /*ngOnInit(): void {
    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data;
    });
  }*/
  ngOnInit(): void {
    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data;
      this.totalPages = Math.ceil(this.patients.length / this.itemsPerPage);
      this.generatePageNumbers(); // Genera los números de página
      this.updatePagedPatients();
    });
  }

  updatePagedPatients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedPatients = this.patients.slice(startIndex, endIndex);
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
    this.patients.sort((a, b) => {
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

    // Llamada al servicio de pacientes con los filtros de búsqueda
    this.patientService
      .getPatientData(
        Number(this.patientCode),
        this.name,
        this.surname1,
        this.surname2,
        this.dni,
        this.cip,
        this.phone,
        this.status,
        this.bedId
      )
      .subscribe(
        (data) => {
          this.patients = data; // Actualiza la lista de pacientes con los resultados de la búsqueda

          // Resetea la página actual y recalcula la paginación
          this.currentPage = 1;
          this.totalPages = Math.ceil(this.patients.length / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePagedPatients(); // Muestra los pacientes correspondientes a la primera página

          // Una vez que los datos están cargados, mostrar los resultados
          this.isLoading = false; // Finaliza el estado de carga
          this.isVisible = this.patients.length > 0; // Muestra los resultados si hay pacientes
        },
        (error) => {
          console.error('Error al buscar pacientes:', error);
          this.isLoading = false; // Finaliza el estado de carga incluso en caso de error
          this.isVisible = false; // No muestra los resultados si ocurre un error
        }
      );
  }

  isVisible: boolean = false;
  toggleDisplay() {
    this.isVisible = true;
  }
}
