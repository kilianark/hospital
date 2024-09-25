import { Component } from '@angular/core';
import { RoomInterface } from '../../../interfaces/room.interface';
import { Router } from '@angular/router';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { countries } from '../../../../../store/country-data.store';


@Component({
  selector: 'app-search-room',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchRoomComponent {

  constructor(private router: Router) {}
  title = 'Búsqueda Habitaciones:'

  room: RoomInterface[] = [
    { id: 1, room_number: 101, capacity: 1, area: "Urgencias", floor: 0,  availability: false, idpatient: 123456 }, // Sin idpatient
    { id: 2, room_number: 204, capacity: 1, area: "UCI", floor: 1, availability: true} // Con idpatient
     ];

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  
  goToManage(patientId: number | undefined) {
    if (patientId !== undefined) {
      this.router.navigate(['/home/patient/manage', { id: patientId }]);
    } else {
      console.log('No hay paciente asignado a esta habitación.');
    }
  }
  isVisible: boolean=false;
  toggleDisplay(){
    this.isVisible = true;
  }
}
