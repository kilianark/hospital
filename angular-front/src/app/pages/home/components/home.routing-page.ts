import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../login/components/login.component';
import { SearchPatientComponent } from './patient/search/search.component'; 
import { CreatePatientComponent } from './patient/create/create.component';
import { SearchRoomComponent } from './room/search/search.component';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { ManagePatientComponent } from './patient/manage/manage.component';

// lista de rutes per exemple per posar en Routes
// { path: 'nomdel enllaç', component: nomVariable(per defecte es posa, en el navbar.component.ts) } por defecto va a la pagina de inicio

// en navbar.components.ts barra de navegació, li posem un atribut de tipus routerLink="/...", routerLinkActive="active" <- atribut, que en css li estilitzem ....> .nav-link.active, i tambe ho importem al templateURL, i style que li assignem
//navbar li importem els dos links i lactive.
export const routes: Routes = [

    { path: 'manage-patient', component: ManagePatientComponent},
    { path: 'confirmation', component: ConfirmComponent },
    { path: 'search-patient', component: SearchPatientComponent },
    { path: 'create-patient', component: CreatePatientComponent },
    { path: 'search-room', component: SearchRoomComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // quan la ruta es incorrecte o qualsevol cosa

];

@NgModule({
    imports: [RouterModule.forRoot(routes), MatDialogModule],
    exports: [RouterModule]
  })

  export class HomeRoutingModule { }


