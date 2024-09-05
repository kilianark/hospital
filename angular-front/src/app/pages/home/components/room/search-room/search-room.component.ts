import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Roomsearch } from '../../../interfaces/room.interface';

@Component({
  selector: 'app-search-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.css'
})
export class SearchRoomComponent {
  title = 'Búsqueda Habitaciones:'

  room: Roomsearch[] = [
    { numero: "001", tipo: "Box", planta: 0, area: "Urgencias", capacidad: 1, disponible: "Si" },
    { numero: "100", tipo: "Cubículo", planta: 1, area: "UCI", capacidad: 1, disponible: "Si" }
  ]

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }
}
