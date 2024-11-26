import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { EmergenciesComponent } from '../../pages/home/components/emergencies/emergencies.component';
import { PoolPatientsComponent } from '../../pages/home/components/emergencies/pool-patients/pool-patients.component';

const routes: Routes = [
  { path: '', component: EmergenciesComponent,canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_emergencies']} },
  { path: 'poolPatients', component: PoolPatientsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['pool_patients']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergenciesRoutingModule { }
