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
  title = 'Búsqueda Pacientes:'

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(RecordComponent, {
      width: '80%',
      height: '90%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog'
    });
  }
}
