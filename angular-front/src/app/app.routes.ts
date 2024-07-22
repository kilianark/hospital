import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SearchPatientComponent } from './patient/search/search.component';
import { CreatePatientComponent } from './patient/create/create.component';
import { SearchRoomComponent } from './room/search/search.component';
import { CreateRoomComponent } from './room/create/create.component';
import { DischargeComponent } from './patient/discharge/discharge.component';

// lista de rutes per exemple per posar en Routes
// { path: 'nomdel enllaç', component: nomVariable(per defecte es posa, en el navbar.component.ts) } por defecto va a la pagina de inicio

// en navbar.components.ts barra de navegació, li posem un atribut de tipus routerLink="/...", routerLinkActive="active" <- atribut, que en css li estilitzem ....> .nav-link.active, i tambe ho importem al templateURL, i style que li assignem
//navbar li importem els dos links i lactive.
export const routes: Routes = [

    { path: 'search-patient', component: SearchPatientComponent },
    { path: 'create-patient', component: CreatePatientComponent },
    { path: 'search-room', component: SearchRoomComponent },
    { path: 'create-room', component: CreateRoomComponent},
    { path: 'discharge-patient', component: DischargeComponent},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }


