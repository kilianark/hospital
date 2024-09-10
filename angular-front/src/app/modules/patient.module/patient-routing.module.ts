import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';


const routes: Routes = [
  { path: '', },
  { path: 'manage-patient', component: ManagePatientComponent },
  { path: 'search-patient', component: SearchPatientComponent },
  { path: 'create-patient', component: CreatePatientComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
