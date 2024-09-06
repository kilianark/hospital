import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePatientComponent } from './components/patient/manage/manage.component';
import { SearchPatientComponent } from './components/patient/search/search.component';
import { CreatePatientComponent } from './components/patient/create/create.component';
import { SearchRoomComponent } from './components/room/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'manage-patient', component: ManagePatientComponent },
  { path: 'search-patient', component: SearchPatientComponent },
  { path: 'create-patient', component: CreatePatientComponent },
  { path: 'search-room', component: SearchRoomComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
