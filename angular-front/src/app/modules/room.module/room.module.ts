import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { RoomRoutingModule } from './room-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoomRoutingModule
  ],
  providers:[provideHttpClient()]
})
export class RoomModule { }
