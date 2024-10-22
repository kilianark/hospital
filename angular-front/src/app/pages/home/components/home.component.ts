import { Component } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { PatientInterface } from '../../../interfaces/patient.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
  })

export class HomeComponent {
  patients: PatientInterface[];
  title = 'MedicaPlus';
  constructor(private service: PatientService) {
    service.getPatientData().subscribe(data => {
      this.patients = data
  });
  }
  
}