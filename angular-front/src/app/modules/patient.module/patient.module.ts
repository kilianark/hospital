import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreatePatientComponent,
    ManagePatientComponent,
    SearchPatientComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PatientRoutingModule
  ]
})
export class PatientModule { }
