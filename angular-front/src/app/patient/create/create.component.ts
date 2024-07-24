import { Component } from '@angular/core';
<<<<<<< HEAD
import { countries } from '../../shared/store/country-data.store';
import { CommonModule } from '@angular/common';
=======
import { HeaderComponent } from "../../navigate/header/header.component";
>>>>>>> d2477264181b46f36e703f04e1b1057149dfdfa3

@Component({
  selector: 'app-create-patient',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule],
=======
  imports: [HeaderComponent],
>>>>>>> d2477264181b46f36e703f04e1b1057149dfdfa3
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {

}
