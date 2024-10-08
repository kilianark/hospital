import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';

import { RequiredComponent } from '../../components/required/required.component';
import { EnumToStringPipe } from '../../pipe/enum-to-string.pipe';

@NgModule({
  declarations: [
    CreatePatientComponent,
    ManagePatientComponent,
    SearchPatientComponent,
    EnumToStringPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PatientRoutingModule,
    RequiredComponent,
    
  ],
  providers: [provideHttpClient()],
})
export class PatientModule {}
