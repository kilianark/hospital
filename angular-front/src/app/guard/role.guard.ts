import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, GuardResult, MaybeAsync } from "@angular/router";
import { KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      const requiredRoles = route.data['roles'] as Array<string>;

      if (!requiredRoles || requiredRoles.length == 0) return true;

      const userRoles = this.keycloakService.getUserRoles();

      const hasRole = requiredRoles.some(role => userRoles.includes(role));

      if(!hasRole) {
        this.router.navigate(['no-acces'])
      }
  }
}