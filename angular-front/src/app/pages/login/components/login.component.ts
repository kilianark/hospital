import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  title = 'MedicaPlus';
  authenticated = false;
  isUser = false;
  isAdmin = false;

  constructor(private readonly keycloak: KeycloakService) {
    
    
  }

  login() {
    this.keycloak.login()
  }
}
