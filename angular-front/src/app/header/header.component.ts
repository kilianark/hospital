import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
    imports: [CommonModule]
  })

export class HeaderComponent {
  title = 'MedicaPlus';
  nav1 = 'Inicio';
  nav2 = 'Urgencias';
}