import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from '../../pages/home/components/room/room.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';

const routes: Routes = [
  { path: '', component: RoomComponent},
  { path: 'search', component: SearchRoomComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
