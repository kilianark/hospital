import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { WorkerService } from '../../../../../services/worker.service';
import { FormBuilder, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { SortDirection } from '@angular/material/sort';
import Fuse from 'fuse.js';
import { MaterialModule } from '../../../../../shared/modules/material.module';
import { HospitalService } from '../../../../../services/hospital.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../../../services/spinner.service';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import SpinnerComponent from '../../../../../shared/components/spinner/spinner.component';
@Component({  
  selector: 'app-search-worker',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchWorkerComponent implements OnInit {
  title = 'Búsqueda Trabajadores:';

  workers: WorkerInterface[] = [];
  filteredworkers: WorkerInterface[] = [];
  allFilteredworkers: WorkerInterface[] = [];

  fuseName: Fuse<WorkerInterface> | null = null;
  fuseSurname1: Fuse<WorkerInterface> | null = null;
  fuseSurname2: Fuse<WorkerInterface> | null = null;

  isLoading = false;

  pageNumbers: number[] = [];
  sortField: string = 'name';
  sortDirection: SortDirection = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  workerForm: FormGroup;

  workerCode: string = '';
  name: string = '';
  surname1: string = '';
  surname2: string = '';
  dni: string = '';
  worktype: string = '';
  phone: string = '';
  status: string = '';
  hospital: number = 0;
  isVisible: boolean = false;//barra
  showSelect: boolean = false;

  hospitals: HospitalInterface[] = [];

  workerStatus = Object.keys(HospitalZone)
    .filter(
      (key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone]))
    )
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private WorkerService: WorkerService,
    private hospitalService: HospitalService,
    private translator: TranslateService,
    private spinnerService: SpinnerService
  ) {
    this.translator.use('es');

    this.workerForm = this.formBuilder.group({
      hospital: [[], { nonNullable: true }], //esto permite selección múltiple
      status: [null],
      workerCode: [this.workerCode],
      name: [this.name],
      surname1: [this.surname1],
      surname2: [this.surname2],
      dni: [this.dni],
      worktype: [this.worktype],
      phone: [this.phone],
    });

    this.workerForm.valueChanges.subscribe((formValues) => {
      this.hospital = formValues.hospital;
      this.workerCode = formValues.workerCode;
      this.name = formValues.name;
      this.surname1 = formValues.surname1;
      this.surname2 = formValues.surname2;
      this.dni = formValues.dni;
      this.worktype = formValues.worktype;
      this.phone = formValues.phone;
    });
  }

  ngOnInit(): void {

    this.loadHospitalsData();

    this.WorkerService.getWorkerData().subscribe((data) => {
      this.workers = data.map(worker => ({
        ...worker,
        status: worker.zone
      }));

      this.fuseName = new Fuse(this.workers, {
        keys: ['name'],
        threshold: 0.3,
      });

      this.fuseSurname1 = new Fuse(this.workers, {
        keys: ['surname1'],
        threshold: 0.3,
      });

      this.fuseSurname2 = new Fuse(this.workers, {
        keys: ['surname2'],
        threshold: 0.3,
      });

      this.WorkerService.workerUpdated$.subscribe((updatedWorker: WorkerInterface) => {
        this.updateworkerInList(updatedWorker);
      })
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

  updateworkerInList(updatedworker: WorkerInterface) {
    const index = this.workers.findIndex(p => p.id === updatedworker.id);
    if (index !== -1) {
      this.workers[index] = updatedworker;
      this.filteredworkers[index] = updatedworker;
      this.updatePagedworkers();
    }
  }

  updatePagedworkers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredworkers = this.allFilteredworkers.slice(startIndex, endIndex);
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
      this.updatePagedworkers();
      this.generatePageNumbers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedworkers();
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
    this.sortworkers();
  }

  sortworkers() {
    this.allFilteredworkers.sort((a, b) => {
      let comparison = 0;

      if (typeof a[this.sortField] === 'string') {
        comparison = a[this.sortField].localeCompare(b[this.sortField]);
      } else {
        comparison = a[this.sortField] - b[this.sortField];
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.updatePagedworkers();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedworkers();
  }

  searchworkers() {

    this.isVisible = false;

    const name = this.workerForm.get('name')?.value || '';
    const surname1 = this.workerForm.get('surname1')?.value || '';
    const surname2 = this.workerForm.get('surname2')?.value || '';
    const dni = this.workerForm.get('dni')?.value || '';
    const worktype = this.workerForm.get('worktype')?.value || '';
    const workerCode = this.workerForm.get('workerCode')?.value || '';
    const phone = this.workerForm.get('phone')?.value || '';
    const status = this.workerForm.get('status')?.value || '';
    const selectedHospitals = this.workerForm.get('hospital')?.value.map(Number) || [];


    let exactFilteredworkers = this.workers;

    if (dni) {
      exactFilteredworkers = exactFilteredworkers.filter((worker) =>
        String(worker.dni) === dni
      );
    }

    if (worktype) {
      exactFilteredworkers = exactFilteredworkers.filter((worker) =>
        String(worker.worktype) === worktype
      );
    }

    if (phone) {
      exactFilteredworkers = exactFilteredworkers.filter((worker) =>
        String(worker.phone) === phone
      );
    }

    if (workerCode) {
      exactFilteredworkers = exactFilteredworkers.filter((worker) =>
        String(worker.id) === workerCode
      );
    }

    if (selectedHospitals.length > 0) {
      exactFilteredworkers = exactFilteredworkers.filter((worker) =>
        selectedHospitals.includes(worker.hospital)
      );
    }

    let fuzzyFilteredworkers = exactFilteredworkers;

    if (this.fuseName && name) {
      const fuzzyResultsName = this.fuseName.search(name);
      fuzzyFilteredworkers = fuzzyFilteredworkers.filter((worker) =>
        fuzzyResultsName.some((result) => result.item === worker)
      );
    }

    if (this.fuseSurname1 && surname1) {
      const fuzzyResultsSurname1 = this.fuseSurname1.search(surname1);
      fuzzyFilteredworkers = fuzzyFilteredworkers.filter((worker) =>
        fuzzyResultsSurname1.some((result) => result.item === worker)
      );
    }

    if (this.fuseSurname2 && surname2) {
      const fuzzyResultsSurname2 = this.fuseSurname2.search(surname2);
      fuzzyFilteredworkers = fuzzyFilteredworkers.filter((worker) =>
        fuzzyResultsSurname2.some((result) => result.item === worker)
      );
    }

    this.allFilteredworkers = fuzzyFilteredworkers;
    this.totalPages = Math.ceil(this.allFilteredworkers.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.updatePagedworkers();
    this.isVisible = this.allFilteredworkers.length > 0;

  }

  openDialog(workerId: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: workerId,
    });

    popupRef.afterClosed().subscribe((result) => {
      if (result) {
        this.WorkerService.getWorkerData().subscribe((data) => {
          this.workers = data.map(worker => ({
            ...worker,
            status: worker.zone
          }));
          this.searchworkers();
        });
      }
    });
  }

  goToManage(workerId: number) {
    this.router.navigate(['/home/worker/manage', { id: workerId }]);
  }

  deleteworker(worker: WorkerInterface) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Paciente',
        message: `¿Estás seguro de que deseas eliminar al paciente ${worker.name} ${worker.surname1}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // El usuario confirmó, procedemos a eliminar el paciente
        this.WorkerService.deleteWorkerData(worker.id).subscribe(() => {
          // Eliminamos el paciente de la lista
          this.workers = this.workers.filter(p => p.id !== worker.id);
          this.searchworkers();
          console.log(`Paciente ${worker.name} ${worker.surname1} eliminado.`);
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

    this.searchworkers();

    setTimeout(() => {
      this.spinnerService.hide();
      this.isLoading = false;
    }, 0);
  }

  resetForm() {
    this.workerForm.reset();
    this.isVisible = false;
  }

  toggleDisplay() {
    this.isVisible = true;
  }

  confirm(message: string,type:string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message,type);
  }
}
