import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'MedicaPlus';
  nav1 = 'Urgencias';
  nav2 = 'Consultas';

  isMenuOpen = false;
  private routeSubscription: Subscription = new Subscription;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    
    //cierra el menú al clicar fuera de él
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.isMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
        this.isMenuOpen = false;
      }
    });

    //cierra el menú si cambiamos de ruta
    this.routeSubscription = this.router.events.subscribe(event => {
      if (this.router.url === '/home/profile') {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnDestroy() {

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}