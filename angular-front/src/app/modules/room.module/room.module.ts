import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { RoomRoutingModule } from './room-routing.module';

import { CreateComponent } from '../../pages/home/components/room/create/create.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';

import { SelectPipeComponent } from '../../shared/components/select-pipe/select-pipe.component';
import { ManageComponent } from '../../pages/home/components/room/manage/manage.component';

@NgModule({
  declarations: [
    ManageComponent,

    SearchRoomComponent,
    CreateComponent,
    
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SelectPipeComponent
  ],
  providers: [provideHttpClient()],
})
export class RoomModule {}
