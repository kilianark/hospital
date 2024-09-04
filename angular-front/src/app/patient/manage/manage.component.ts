import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'; // aquest import serà per a que aparegui el llistat de llits
import { SearchRoomComponent } from '../../room/search-room/search-room.component'; // us del component de llista dhabitacions

// potser caldra un pop-up de canvis guardats, que seria un nou component global 

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManagePatientComponent {

}
