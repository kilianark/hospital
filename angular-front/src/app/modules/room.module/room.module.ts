import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { RoomRoutingModule } from './room-routing.module';
import { BedComponent } from '../../pages/home/components/room/bed/bed.component';
import { CreateComponent } from '../../pages/home/components/room/create/create.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { CreateComponentBed } from '../../pages/home/components/room/bed/create/create.component';
import { SelectPipeComponent } from '../../shared/components/select-pipe/select-pipe.component';

@NgModule({
  declarations: [
    BedComponent,
    SearchRoomComponent,
    CreateComponent,
    CreateComponentBed,
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
