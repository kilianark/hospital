import { Component } from '@angular/core';
import { RoomService } from '../../../../../services/room.service';
import { RoomInterface } from '../../../interfaces/room.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-room',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchRoomComponent {
  title = 'Búsqueda Habitaciones:';
  room: RoomInterface[] = [];
  roomForm: FormGroup;
  isVisible: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: RoomService
  ) {
    this.roomForm = this.formBuilder.group({
      roomNumber: [''],
      floor: [''],
      area: [''],
      capacity: [''],
      availability: [''],
    });
  }

  onSubmit() {
    const searchFilters = this.roomForm.value;

    const roomNumber = searchFilters.room_number
      ? parseInt(searchFilters.roomNumber, 10)
      : null;
    const floor = searchFilters.floor
      ? parseInt(searchFilters.floor, 10)
      : null;
    const capacity = searchFilters.capacity
      ? parseInt(searchFilters.capacity, 10)
      : null;
    const availability = searchFilters.availability
      ? searchFilters.availability === 'true'
      : null;

    this.roomService
      .searchRooms(
        roomNumber,
        floor,
        searchFilters.area,
        capacity,
        availability
      )
      .subscribe(
        (rooms: RoomInterface[]) => {
          this.room = rooms;
          this.isVisible = true;
        },
        (error) => {
          console.error('Error al buscar habitaciones:', error);
        }
      );
  }

  goToManage(patientId: number | undefined) {
    if (patientId !== undefined) {
      this.router.navigate(['/home/patient/manage', { id: patientId }]);
    } else {
      console.log(this.room[0]);
      console.log('No hay paciente asignado a esta habitación.');
    }
  }
  toggleDisplay() {
    this.isVisible = true;
  }
}
