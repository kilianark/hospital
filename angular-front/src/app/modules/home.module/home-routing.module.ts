import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { HomeComponent } from '../../pages/home/components/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'patient', 
    loadChildren: () => import('../patient.module/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'room',
    loadChildren: () => import('../room.module/room.module').then(m => m.RoomModule)
  },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
