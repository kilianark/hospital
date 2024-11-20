import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { AppointmentComponent } from '../../pages/home/components/consultation/appointment/appointment.component';

const routes: Routes = [
  { path: '', component: ConsultationComponent },
  { path: 'appointment', component: AppointmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
