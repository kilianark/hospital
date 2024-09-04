import { Component } from '@angular/core';

@Component({
  selector: 'app-search-room',
  standalone: true,
  imports: [],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.css'
})
export class SearchRoomComponent {
  title = 'Busqueda habitaciones:'

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }
}
