import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';


// sempre que es crea un componen s'ha d'importar en @Component a imports, el seu template url, i style url
// fitxers a tocar, component.css/html/ts i app.routes.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HomeComponent, LoginComponent, CommonModule, HeaderComponent],
})

export class AppComponent {
  title = 'MedicaPlus';
}
