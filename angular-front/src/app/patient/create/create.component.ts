import { Component } from '@angular/core';
import { HeaderComponent } from "../../navigate/header/header.component";
import { countries } from '../../shared/store/country-data.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {
  public countries:any = countries
  
  constructor(){}

  ngOnInit(): void {
  }

}
