import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { CreateComponent } from '../../pages/home/components/consultation/appointment/create/create.component';
import { ManageComponent } from '../../pages/home/components/consultation/appointment/search/search.component';
import { CalendarComponent } from '../../pages/home/components/consultation/calendar/calendar.component';

import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
const routes: Routes = [
  { path: '', component: ConsultationComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['create_appointment']}},
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['search_appointment']}},
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['manage_calendar']}},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
