import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { EmergenciesComponent } from '../../pages/home/components/emergencies/emergencies.component';

const routes: Routes = [
  { path: '', component: EmergenciesComponent,canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_emergencies']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergenciesRoutingModule { }
