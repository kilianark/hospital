import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
  })

export class HeaderComponent implements OnInit, OnDestroy{
  title = 'MedicaPlus';
  nav1 = 'Urgencias';
  nav2 = 'Consultas';

  isMenuOpen = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Añadir un listener para hacer clic en el documento
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.isMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
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