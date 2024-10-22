import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { PatientInterface } from '../../../interfaces/patient.interface';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
  })

export class HomeComponent implements OnInit {
  patients: PatientInterface[];
  title = 'MedicaPlus';
  constructor(private service: PatientService, private keycloak: KeycloakService) {
    service.getPatientData().subscribe(data => {
      this.patients = data
  });
  }
  
  ngOnInit(): void {
    console.log(this.keycloak.getUsername());
    let userDetails = this.keycloak.loadUserProfile();
    console.log(userDetails);
  }
}