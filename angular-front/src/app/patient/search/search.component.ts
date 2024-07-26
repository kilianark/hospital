import { Component } from '@angular/core';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [],  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchPatientComponent {
  title = 'Busqueda Paciente:'

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }
}
