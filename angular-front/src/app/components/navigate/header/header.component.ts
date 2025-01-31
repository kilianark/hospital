import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { KeycloakService } from 'keycloak-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
})
export class HeaderComponent
  implements OnInit
{
  doctorID : number;
  username;
  isMenuOpen = false;
  private routeSubscription: Subscription = new Subscription();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private readonly keycloak: KeycloakService,
    private translator: TranslateService
  ) {
    this.translator.use('es');
  }
  menu = true;
  onClick() {
    const htmlmenu = document.getElementById('menu') as HTMLElement;
    const htmlclose = document.getElementById('notMenu') as HTMLElement;
    const sidebar = document.getElementById('sidebarTS') as HTMLElement;
    this.menu = !this.menu; // Toggle the menu state

    // Update the display properties based on the new menu state
    htmlmenu?.style.setProperty('display', this.menu ? 'block' : 'none');
    htmlclose?.style.setProperty('display', this.menu ? 'none' : 'block');
    sidebar?.style.setProperty('display', this.menu ? 'none' : 'flex');
  }
  ngOnInit() {
    //cierra el menú al clicar fuera de él
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.isMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
        this.isMenuOpen = false;
      }
    });

    //cierra el menú si cambiamos de ruta
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (this.router.url === '/home/profile') {
        this.isMenuOpen = false;
      }
    });

   this.username = this.keycloak.getUsername();
   this.keycloak.loadUserProfile().then((profile) => {
    this.doctorID = profile.attributes['doctorID'][0];
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToProfile(doctorId: number) {
    this.router.navigate(['/home/profile', { id: doctorId }]);
  }
  logout() {
    this.keycloak.logout("http://localhost:4200/home");
  }
}
