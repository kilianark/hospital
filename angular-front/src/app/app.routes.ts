import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';

import { LoginComponent } from './pages/login/components/login.component';
import { HomeModule } from './modules/home.module/home.module';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home.module/home.module').then((m) => m.HomeModule), // Lazy load del módulo Home
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MatDialogModule,
    HomeModule
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }