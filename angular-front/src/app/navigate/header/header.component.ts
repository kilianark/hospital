import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
  })

export class HeaderComponent {
  title = 'MedicaPlus';
}