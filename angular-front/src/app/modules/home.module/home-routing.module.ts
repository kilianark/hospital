import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { ProfileComponent } from '../../pages/home/components/profile/profile.component';
import { HomeComponent } from '../../pages/home/components/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'search-room', component: SearchRoomComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
