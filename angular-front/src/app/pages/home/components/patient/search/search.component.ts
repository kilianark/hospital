import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';

@Component({
  selector: 'app-search-patient',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent {
  title = 'Búsqueda Pacientes:';

  patient: PatientInterface[] = [
    { codigo: 1234567, nombre: "Juan", apellido1: "Martínez", apellido2: "López", telefono: 631238791, edad: 34, birthdate: new Date("1990-09-12"), estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"},
    { codigo: 7654321, nombre: "Maria", apellido1: "Pérez", apellido2: "Castro", telefono: 621655788, edad: 54, birthdate: new Date("1970-09-12"), estado: "Ambulatorio", tipo: "Urgencia", idcama: "-"}
  ];

  constructor(public dialog: MatDialog, private router: Router) {}

  openDialog() {
    this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog'
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }
}