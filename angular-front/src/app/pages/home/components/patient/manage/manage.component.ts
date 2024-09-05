import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog'; // aquest import serà per a que aparegui el llistat de llits
import { SearchRoomComponent } from '../../room/search/search.component'; // us del component de llista dhabitacions
 
// potser caldra un pop-up de canvis guardats, que seria un nou component global

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManagePatientComponent implements OnInit {
  title = 'Gestionar Paciente:'

  patientId: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['id']; // "+" para convertir a número
      console.log('Patient ID:', this.patientId);
      // Aquí puedes cargar los datos del paciente con la ID obtenida
    });
  }
}