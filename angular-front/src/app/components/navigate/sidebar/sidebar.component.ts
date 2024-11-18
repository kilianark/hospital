import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HasRoleDirective } from '../../../directives/has-role.directive';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HasRoleDirective ]
  })

export class SidebarComponent {
}