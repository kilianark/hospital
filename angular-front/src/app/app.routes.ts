import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component'
import { BrowserModule } from '@angular/platform-browser';

// lista de rutes per exemple per posar en Routes
// { path: 'nomdel enllaç', component: nomVariable(per defecte es posa, en el navbar.component.ts) } por defecto va a la pagina de inicio

// en navbar.components.ts barra de navegació, li posem un atribut de tipus routerLink="/...", routerLinkActive="active" <- atribut, que en css li estilitzem ....> .nav-link.active, i tambe ho importem al templateURL, i style que li assignem 
//navbar li importem els dos links i lactive.
export const routes: Routes = [

    { path: 'approutelogin', component: AppComponent },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }


