import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { HomeComponent } from '../../pages/home/components/home.component';
import { AuthGuard } from '../../guard/auth.guard';
import { RoleGuard } from '../../guard/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'patient',canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_patients']}, loadChildren: () => import('../patient.module/patient.module').then(m => m.PatientModule)},
  {path: 'room', canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_rooms']}, loadChildren: () => import('../room.module/room.module').then(m => m.RoomModule)},
  {path: 'worker', canActivate: [AuthGuard, RoleGuard], data: { roles: ['general_workers']}, loadChildren: () => import('../worker.module/worker.module').then(m => m.WorkerModule)},
  {path:'consultation', canActivate:[AuthGuard,RoleGuard], data:{roles:['general_consultations']},loadChildren:()=>import('../consultation.module/consultation.module').then(m=> m.ConsultationModule)},
  {path: 'emergencies', canActivate:[AuthGuard, RoleGuard], data: {roles: ['general_emergencies']}, loadChildren:()=>import('../emergencies.module/emergencies.module').then(m => m.EmergenciesModule)},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
