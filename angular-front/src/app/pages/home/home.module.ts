import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home.component';
import { SearchPatientComponent } from './components/patient/search/search.component';
import { CreatePatientComponent } from './components/patient/create/create.component';
import { SearchRoomComponent } from './components/room/search/search.component';
import { ManagePatientComponent } from './components/patient/manage/manage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent,
    CreatePatientComponent,
    ManagePatientComponent,
    SearchPatientComponent,
    ProfileComponent,
    SearchRoomComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class HomeModule { }
