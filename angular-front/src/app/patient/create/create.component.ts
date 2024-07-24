import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
<<<<<<< HEAD
import { countries } from '../../shared/store/country-data.store';
import { CommonModule } from '@angular/common';
=======
>>>>>>> parent of f0fa408 (creacio sidebar, mòduls navegació, rutes actualitzades)

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
