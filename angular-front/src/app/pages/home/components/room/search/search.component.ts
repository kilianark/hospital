import { Component } from '@angular/core';
import { Roomsearch } from '../../../interfaces/room.interface';
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

  room: Roomsearch[] = [
    { numero: "101", tipo: "Box", planta: 0, area: "Urgencias", capacidad: 1, disponible: "No", idpatient: 1234567 },
    { numero: "204", tipo: "Cubículo", planta: 1, area: "UCI", capacidad: 1, disponible: "Si", idpatient: 7654321}
  ]

  patient: PatientInterface[] = [
    { code: 1234567, name: "Juan", surname1: "Martínez", surname2: "López", dni: "", cip: "", gender: "", phone: "631238791", email: "", age: 34, birthdate: new Date("1990-09-12"), country: countries[208].name, status: "Ambulatorio", address: "", idBed: "-"},
    { code: 7654321, name: "Maria", surname1: "Pérez", surname2: "Castro", dni: "", cip: "", gender: "", phone: "621655788", email: "", age: 54, birthdate: new Date("1970-09-12"), country: countries[208].name, status: "Ambulatorio", address: "", idBed: "-"}
  ];

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  
  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }
}
