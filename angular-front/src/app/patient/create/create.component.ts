import { Component } from '@angular/core';
//import { countries } from '../../shared/store/country-data.store';
import { CommonModule } from '@angular/common';
import { countries } from '../../shared/store/country-data.store';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {
  public countries:any = countries
}
