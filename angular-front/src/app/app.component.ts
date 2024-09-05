import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { LoginComponent } from "./pages/login/components/login.component";
import { HeaderComponent } from './components/navigate/header/header.component';
import { HomeComponent } from './pages/home/components/home.component';
import { SidebarComponent } from './components/navigate/sidebar/sidebar.component';


// sempre que es crea un componen s'ha d'importar en @Component a imports, el seu template url, i style url
// fitxers a tocar, component.css/html/ts i app.routes.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HomeComponent, LoginComponent, CommonModule, HeaderComponent, SidebarComponent],
})

export class AppComponent {
  title = 'MedicaPlus';

  public showNavBar = true;

toggleNavBar(component: Component) {
   if(component instanceof LoginComponent) {
      this.showNavBar = false;
   } else {
      this.showNavBar = true;
   }
}
}
