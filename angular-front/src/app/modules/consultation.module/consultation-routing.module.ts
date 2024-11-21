import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { AppointmentComponent } from '../../pages/home/components/consultation/appointment/appointment.component';

import { EconsultaComponent } from '../../pages/home/components/consultation/econsulta/econsulta/econsulta.component';
import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
const routes: Routes = [
  { path: '', component: ConsultationComponent },
  { path: 'appointment', component: AppointmentComponent}

  { path: 'econsulta', component: EconsultaComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_patients']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
