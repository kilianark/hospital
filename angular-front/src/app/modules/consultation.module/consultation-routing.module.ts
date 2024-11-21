import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { AppointmentsComponent } from '../../pages/home/components/consultation/appointment/appointment.component';
import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
const routes: Routes = [
  { path: '', component: ConsultationComponent },
  { path: 'appointment', component: AppointmentsComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['administrative_workers']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
