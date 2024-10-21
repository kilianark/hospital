import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { RoomRoutingModule } from './room-routing.module';
import { BedComponent } from '../../pages/home/components/room/bed/bed.component';
import { CreateComponent } from '../../pages/home/components/room/create/create.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
  declarations: [
    BedComponent,
    SearchRoomComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  providers: [provideHttpClient()]
})
export class RoomModule { }
