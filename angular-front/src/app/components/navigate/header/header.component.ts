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
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'MedicaPlus';
  nav1 = 'Urgencias';
  nav2 = 'Consultas';

  isMenuOpen = false;
  private routeSubscription: Subscription = new Subscription();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}
  menu = true;
  onClick() {
    const htmlmenu = document.getElementById('menu') as HTMLElement;
    const htmlclose = document.getElementById('notMenu') as HTMLElement;

    this.menu = !this.menu; // Toggle the menu state

    // Update the display properties based on the new menu state
    htmlmenu?.style.setProperty('display', this.menu ? 'block' : 'none');
    htmlclose?.style.setProperty('display', this.menu ? 'none' : 'block');
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
  }

  ngOnDestroy() {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
