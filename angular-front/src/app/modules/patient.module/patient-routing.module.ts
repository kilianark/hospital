import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { PatientComponent } from '../../pages/home/components/patient/patient.component';


const routes: Routes = [
  { path: '', component: PatientComponent},
  { path: 'manage', component: ManagePatientComponent },
  { path: 'search', component: SearchPatientComponent },
  { path: 'create', component: CreatePatientComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }