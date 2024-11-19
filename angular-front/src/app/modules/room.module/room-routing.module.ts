import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from '../../pages/home/components/room/room.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { CreateComponent } from '../../pages/home/components/room/create/create.component';
import { ManageComponent } from '../../pages/home/components/room/manage/manage.component';
import { RoleGuard } from '../../guard/role.guard';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  { path: '', component: RoomComponent },
  { path: 'search', component: SearchRoomComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['search_room']} },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['create_room']} },
  { path: 'manage', component: ManageComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manage_room']}}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
