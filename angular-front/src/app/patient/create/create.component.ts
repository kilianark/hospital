import { Component } from '@angular/core';
import { HeaderComponent } from "../../navigate/header/header.component";

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {

}
