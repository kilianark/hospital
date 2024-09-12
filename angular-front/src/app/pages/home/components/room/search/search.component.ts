import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Roomsearch } from '../../../interfaces/room.interface';
import { Router } from '@angular/router';
import { PatientInterface } from '../../../../../interfaces/patient.interface';


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
    { codigo: 1234567, nombre: "Juan", apellido1: "Martínez", apellido2: "López", telefono: 631238791, edad: 34, birthdate: new Date("1990-09-12"), estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"},
    { codigo: 7654321, nombre: "Maria", apellido1: "Pérez", apellido2: "Castro", telefono: 621655788, edad: 54, birthdate: new Date("1970-09-12"), estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"}
  ];

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  
  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }
}
