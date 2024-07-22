import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchPatientComponent {
  title = 'Busqueda Paciente:'
}
