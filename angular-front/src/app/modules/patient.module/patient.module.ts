import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';

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
    PatientRoutingModule,
  ],
  providers:[provideHttpClient()]
})
export class PatientModule { }
