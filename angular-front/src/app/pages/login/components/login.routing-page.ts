import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../home/components/home.component';
import { LoginComponent } from './login.component';


// lista de rutes per exemple per posar en Routes
// { path: 'nomdel enllaç', component: nomVariable(per defecte es posa, en el navbar.component.ts) } por defecto va a la pagina de inicio

// en navbar.components.ts barra de navegació, li posem un atribut de tipus routerLink="/...", routerLinkActive="active" <- atribut, que en css li estilitzem ....> .nav-link.active, i tambe ho importem al templateURL, i style que li assignem
//navbar li importem els dos links i lactive.
export const routes: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // quan la ruta es incorrecte o qualsevol cosa

];

export class LoginRoutingModule { }


