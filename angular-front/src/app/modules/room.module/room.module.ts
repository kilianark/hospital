import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { RoomRoutingModule } from './room-routing.module';
import { BedComponent } from '../../pages/home/components/room/bed/bed.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BedComponent,
    SearchRoomComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[provideHttpClient()]
})
export class RoomModule { }
