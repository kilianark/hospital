import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../../../services/room.service';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { TranslateService } from '@ngx-translate/core';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';
import { HospitalService } from '../../../../../services/hospital.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../../../services/spinner.service';
import SpinnerComponent from '../../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-search-room',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchRoomComponent implements OnInit {
  title = 'Búsqueda Habitaciones:';
  rooms: RoomInterface[] = [];
  roomForm: FormGroup;
  isVisible: boolean = false;

  hospitals: HospitalInterface[] = [];
  pagedRooms: RoomInterface[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  sortField: string = 'roomNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  HospitalZone = HospitalZone;

  showSelect: boolean;

  hospitalZones = Object.keys(HospitalZone)
    .filter(
      (key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone]))
    )
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));
  //
  ambulatoryArea = Object.keys(AmbulatoryArea)
    .filter(
      (key) =>
        !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea]))
    )
    .map((key) => ({
      value: AmbulatoryArea[key as keyof typeof AmbulatoryArea],
    }));
  //
  hospitalizedArea = Object.keys(HospitalizedArea)
    .filter(
      (key) =>
        !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea]))
    )
    .map((key) => ({
      value: HospitalizedArea[key as keyof typeof HospitalizedArea],
    }));
  //
  operatingRoomArea = Object.keys(OperatingRoomArea)
    .filter(
      (key) =>
        !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea]))
    )
    .map((key) => ({
      value: OperatingRoomArea[key as keyof typeof OperatingRoomArea],
    }));
  //
  urgencyArea = Object.keys(UrgencyArea)
    .filter(
      (key) => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea]))
    )
    .map((key) => ({ value: UrgencyArea[key as keyof typeof UrgencyArea] }));
  //

  actualZone: HospitalZone;

  selectedZone:
    | AmbulatoryArea
    | HospitalizedArea
    | UrgencyArea
    | OperatingRoomArea
    | null = null;

  currentArea;
  currentAreaType: string;
  isLoading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private roomService: RoomService,
    private translator: TranslateService,
    private hospitalService: HospitalService,
    private spinnerService: SpinnerService
  ) {
    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.roomForm = this.formBuilder.group({
      roomNumber: [''],
      floor: [''],
      zone: [''],
      area: [''],
      capacity: [''],
      availability: [''],
      hospital: [[], { nonNullable: true }]
    });
  }

  ngOnInit(): void {
    this.roomService.getRoomData().subscribe((data) => {
      this.rooms = data;
      this.totalPages = Math.ceil(this.rooms.length / this.itemsPerPage);
      this.sortRooms();
    });

    this.loadHospitalsData();
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

  sortData(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortRooms();
  }

  sortRooms() {
    this.rooms.sort((a, b) => {
      let comparison = 0;
      if (typeof a[this.sortField] === 'string') {
        comparison = a[this.sortField].localeCompare(b[this.sortField]);
      } else {
        comparison = a[this.sortField] - b[this.sortField];
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.updatePagedRooms();
  }

  updatePagedRooms() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedRooms = this.rooms.slice(startIndex, endIndex);
  }

  generatePageNumbers() {
    const totalDisplayedPages = 5;
    this.pageNumbers = [];

    if (this.totalPages <= totalDisplayedPages) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {

      if (this.currentPage <= 3) {
        this.pageNumbers = [1, 2, 3, -1, this.totalPages];
      }
      else if (this.currentPage >= this.totalPages - 2) {
        this.pageNumbers = [
          1,
          -1,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
      }
      else {
        this.pageNumbers = [
          1,
          -1,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          -1,
          this.totalPages,
        ];
      }
    }
  }

  deleteRoom(room: RoomInterface) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Habitación',
        message: `¿Estás seguro de que deseas eliminar la habitación ${room.roomNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // El usuario confirmó, procedemos a eliminar la habitación
        this.isLoading = true;
        this.isVisible = false;

        this.roomService.deleteRoomData(room.id).subscribe(() => {
          this.onSubmit(); // Actualizamos la lista después de eliminar
          this.confirm(`Habitación ${room.roomNumber} eliminada.`, 'success');
          this.isLoading = false;
        },
        error => {
          if (error.status == 400) {
            this.confirm(`Error al eliminar habitación, no se puede eliminar habitación con camas.`, 'error');
          } else {
            this.confirm(`Error al eliminar habitación`, 'error');
          }
          this.onSubmit();
        });
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }

  goToPage(page: number) {
    if (page !== -1 && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagedRooms();
      this.generatePageNumbers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedRooms();
      this.generatePageNumbers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedRooms();
      this.generatePageNumbers();
    }
  }

  onZoneChange(zone: HospitalZone) {
    this.actualZone = zone;
    this.selectedZone = null;

    if (zone !== HospitalZone.Inactivo) {
      this.updateArea();
    }

    this.roomForm.get('area').reset();
    this.currentArea = this.getAreaByZone(zone);
  }

  getAreaByZone(zone: HospitalZone): any[] {
    switch (zone) {
      case HospitalZone.Ambulatorio:
        return this.ambulatoryArea;
      case HospitalZone.Hospitalizacion:
        return this.hospitalizedArea;
      case HospitalZone.Urgencias:
        return this.urgencyArea;
      case HospitalZone.Quirofano:
        return this.operatingRoomArea;
      default:
        return [];
    }
  }

  updateArea() {
    switch (this.actualZone) {
      case HospitalZone.Ambulatorio:
        this.currentArea = this.ambulatoryArea;
        this.currentAreaType = 'AMBULATORY_AREA';
        break;
      case HospitalZone.Hospitalizacion:
        this.currentArea = this.hospitalizedArea;
        this.currentAreaType = 'HOSPITALIZED_AREA';
        break;
      case HospitalZone.Urgencias:
        this.currentArea = this.urgencyArea;
        this.currentAreaType = 'URGENCY_AREA';
        break;
      case HospitalZone.Quirofano:
        this.currentArea = this.operatingRoomArea;
        this.currentAreaType = 'OPERATING_AREA';
        break;
      default:
        this.currentArea = [];
        this.currentAreaType = '';
        break;
    }
  }

  onSubmit() {
    this.spinnerService.show();
    this.isLoading = true;
    this.isVisible = false;

    const searchFilters = this.roomForm.value;
    const roomNumber = searchFilters.roomNumber
      ? parseInt(searchFilters.roomNumber)
      : null;
    const floor = searchFilters.floor ? parseInt(searchFilters.floor) : null;
    const capacity = searchFilters.capacity
      ? parseInt(searchFilters.capacity)
      : null;
    const availability =
      searchFilters.availability !== null ? searchFilters.availability : null;
    const zone = searchFilters.zone ? searchFilters.zone : null;
    const area = searchFilters.area ? searchFilters.area : null;
    const selectedHospitals: number[] = this.roomForm.get('hospital')?.value.map(Number) || [];
    // Llamada al servicio para buscar habitaciones
    this.roomService
      .searchRooms(roomNumber, floor, zone, area, capacity, availability, selectedHospitals)
      .subscribe(
        (rooms: RoomInterface[]) => {
          this.rooms = rooms;
          // Resetea la página actual y actualiza la paginación
          this.currentPage = 1;
          this.totalPages = Math.ceil(this.rooms.length / this.itemsPerPage);
          this.generatePageNumbers();
          this.updatePagedRooms();
          this.spinnerService.hide();
          // Finaliza la carga y muestra los resultados
          this.isLoading = false;//barra
          this.isVisible = true; // Asegura que se muestre el mensaje o los resultados
        },
        (error) => {
          console.error('Error al buscar habitaciones:', error);
          this.spinnerService.hide();
          this.isLoading = false;//barra
          this.isVisible = false; // No muestra los resultados en caso de error
        }
      );
      
  }

  goToRooms(roomId: number) {
    if (roomId !== undefined) {
      this.router.navigate(['/home/room/manage', { id: roomId }]);
    } else {
      console.log(this.rooms[0]);
      console.log('No hay camas asignadas a esta habitación.');
    }
  }

  resetForm() {
    this.roomForm.reset();
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
