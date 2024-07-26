import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../record/record.component';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [],  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchPatientComponent {
  title = 'Busqueda Paciente:'
  atribute1 = 'Nombre:'
  atribute2 = 'Apellidos:'
  atribute3 = 'DNI/NIF:'
  atribute4 = 'Núm. Id:'

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(RecordComponent);
  }
}
