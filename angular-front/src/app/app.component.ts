import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';

// sempre que es crea un componen s'ha d'importar en @Component a imports, el seu template url, i style url
// fitxers a tocar, component.css/html/ts i app.routes.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent],
  templateUrl: './app.component.html'
  
})

export class AppComponent {
  title = 'MedicaPlus';
}
