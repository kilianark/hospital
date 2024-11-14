import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePatientComponent } from '../../pages/home/components/patient/manage/manage.component';
import { SearchPatientComponent } from '../../pages/home/components/patient/search/search.component';
import { CreatePatientComponent } from '../../pages/home/components/patient/create/create.component';
import { PatientComponent } from '../../pages/home/components/patient/patient.component';
import { RoleGuard } from '../../guard/role.guard';


const routes: Routes = [
  { path: '', component: PatientComponent},
  { path: 'manage', component: ManagePatientComponent, canActivate: [RoleGuard], data: { roles: ['manage_patient']} },
  { path: 'search', component: SearchPatientComponent, canActivate: [RoleGuard], data: { roles: ['search_patient']} },
  { path: 'create', component: CreatePatientComponent, canActivate: [RoleGuard], data: {roles: ['create_patient']} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
