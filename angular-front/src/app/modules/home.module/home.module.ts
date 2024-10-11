import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../pages/home/components/home.component';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PatientModule } from '../patient.module/patient.module';

import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RoomModule } from '../room.module/room.module';
import { SharedModule } from '../../shared/shared.module';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    RoomModule,
    ReactiveFormsModule,
    PatientModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class HomeModule { }
