import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { HomeComponent } from '../../pages/home/components/home.component';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'patient', canActivate: [AuthGuard], 
    loadChildren: () => import('../patient.module/patient.module').then(m => m.PatientModule)
  },
  { path: 'room', canActivate: [AuthGuard], 
    loadChildren: () => import('../room.module/room.module').then(m => m.RoomModule)
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
