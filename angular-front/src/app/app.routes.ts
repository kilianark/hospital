import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SearchPatientComponent } from './patient/search/search.component';
import { CreatePatientComponent } from './patient/create/create.component';
import { SearchBedComponent } from './room/search-bed/search-bed.component';
import { SearchRoomComponent } from './room/search-room/search-room.component';
import { RecordComponent } from './patient/record/record.component';
import { SidebarComponent } from './navigate/sidebar/sidebar.component';

// lista de rutes per exemple per posar en Routes
// { path: 'nomdel enllaç', component: nomVariable(per defecte es posa, en el navbar.component.ts) } por defecto va a la pagina de inicio

// en navbar.components.ts barra de navegació, li posem un atribut de tipus routerLink="/...", routerLinkActive="active" <- atribut, que en css li estilitzem ....> .nav-link.active, i tambe ho importem al templateURL, i style que li assignem
//navbar li importem els dos links i lactive.
export const routes: Routes = [
<<<<<<< HEAD
<<<<<<< HEAD
   
=======
>>>>>>> bbcc520024ca263a8a81c355462c8ba008f3f838
=======
    { path: 'sidebar', component: SidebarComponent }, //temporal para visualizar
>>>>>>> d2477264181b46f36e703f04e1b1057149dfdfa3
    { path: 'patient', component: RecordComponent },
    { path: 'search-patient', component: SearchPatientComponent },
    { path: 'create-patient', component: CreatePatientComponent },
    { path: 'search-room', component: SearchRoomComponent },
    { path: 'search-bed', component: SearchBedComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // quan la ruta es incorrecte o qualsevol cosa

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }


