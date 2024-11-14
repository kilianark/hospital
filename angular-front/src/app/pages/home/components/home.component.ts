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
  title = 'MedicaPlus';

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    const roles = this.keycloakService.getKeycloakInstance().realmAccess.roles;
    console.log(roles)
  }

}