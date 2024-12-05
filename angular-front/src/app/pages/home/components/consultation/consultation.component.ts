import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css',
})
export class ConsultationComponent {
  title = 'Consultas';

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    const roles = this.keycloakService.getUserRoles();
    console.log(roles)
  }

}
