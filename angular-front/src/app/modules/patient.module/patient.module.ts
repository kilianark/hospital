import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { PatientFormComponent } from '../../shared/components/patient-form/patient-form.component';
import { SelectZoneComponent } from "../../shared/components/select-zone/select-zone.component";
import { MedicalEpisodeComponent } from '../../pages/home/components/patient/medical-episode/medical-episode.component';
import { PatientComponent } from '../../pages/home/components/patient/patient.component';
@NgModule({
  declarations: [
    CreatePatientComponent,
    ManagePatientComponent,
    SearchPatientComponent,
    PatientComponent,
    MedicalEpisodeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PatientRoutingModule,
    SharedModule,
    PatientFormComponent,
    SelectZoneComponent
],
  providers: [provideHttpClient()],
})
export class PatientModule { }
