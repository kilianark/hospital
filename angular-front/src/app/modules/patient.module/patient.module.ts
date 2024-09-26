import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';

import { OperatingRoomAreaPipe } from '../../pipe/operating-room-area.pipe';

import { RequiredComponent } from '../../components/required/required.component';

@NgModule({
  declarations: [
    CreatePatientComponent,
    ManagePatientComponent,
    SearchPatientComponent,
    OperatingRoomAreaPipe
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
