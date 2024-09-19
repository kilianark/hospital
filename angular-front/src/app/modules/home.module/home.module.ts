import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../pages/home/components/home.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PatientModule } from '../patient.module/patient.module';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    SearchRoomComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PatientModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  providers: [provideHttpClient()]
})
export class HomeModule { }
