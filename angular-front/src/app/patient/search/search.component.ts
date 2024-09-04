import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../record/record.component';
import { Patientsearch } from './patientsearch';

@Component({
  selector: 'app-search-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent {
  title = 'Búsqueda Pacientes:'

  patient: Patientsearch[] = [
    { codigo: 1234567, nombre: "Funciona", apellido1: "Martínez", apellido2: "López",  edad: 34, telefono: 631238791, estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"},
    { codigo: 7654321, nombre: "Maria", apellido1: "Pérez", apellido2: "Castro", edad: 54, telefono: 621655788, estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"}
  ];

  onSubmit() {
    //canviar esto por el paciente/s encontrado por la api
    console.log('Formulario enviado');
  }

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog'
    });
  }
}
