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
  rooms: RoomInterface[] = [];
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

    const roomNumber = searchFilters.roomNumber
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
          this.rooms = rooms;
          this.isVisible = true;
        },
        (error) => {
          console.error('Error al buscar habitaciones:', error);
        }
      );
  }


  
    goToRooms(roomId: number) {
      if (roomId !== undefined) {
      this.router.navigate(['/home/room/beds', roomId]);
    }else {
      console.log(this.rooms[0]);
      console.log('No hay camas asignadas a esta habitación.');
    }
    }

  toggleDisplay() {
    this.isVisible = true;
  }
}
