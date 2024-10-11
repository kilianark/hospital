import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { RoomRoutingModule } from './room-routing.module';
import { BedComponent } from '../../pages/home/components/room/bed/bed.component';
import { CreateComponent } from '../../pages/home/components/room/create/create.component';
import { SearchRoomComponent } from '../../pages/home/components/room/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
        // Angular Material imports
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,


  ],
  providers: [provideHttpClient()]
})
export class RoomModule { }
