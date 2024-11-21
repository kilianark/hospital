import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { CreateComponent } from '../../pages/home/components/consultation/appointment/create/create.component';
import { ManageComponent } from '../../pages/home/components/consultation/appointment/manage/manage.component';


import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
const routes: Routes = [
  { path: '', component: ConsultationComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['administrative_workers']}},
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['administrative_workers']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
