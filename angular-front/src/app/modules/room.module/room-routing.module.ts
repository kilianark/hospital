import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from '../../pages/home/components/room/room.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { BedComponent } from '../../pages/home/components/room/bed/bed.component';

const routes: Routes = [
  { path: '', component: RoomComponent},
  { path: 'search', component: SearchRoomComponent},
  { path: 'beds/:id', component: BedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
