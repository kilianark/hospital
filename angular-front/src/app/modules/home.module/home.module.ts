import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../pages/home/components/home.component';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class HomeModule { }
