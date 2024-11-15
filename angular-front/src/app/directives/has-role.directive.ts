import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole!: string;

  constructor(private element: ElementRef, private renderer: Renderer2, private keycloakService: KeycloakService) { }

  ngOnInit(): void {

    console.log('Elemento:', this.element);

    const rolesRequired = this.appHasRole.split(',');

    const userRoles = this.keycloakService.getKeycloakInstance().realmAccess.roles;

    if (rolesRequired.some(role => userRoles.includes(role))) {
      this.renderer.setStyle(this.element.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
    }
  }
}
