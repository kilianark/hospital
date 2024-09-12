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
    { code: 1234567, name: "Juan", surname1: "Martínez", surname2: "López", phone: 631238791, age: 34, birthdate: new Date("1990-09-12"), status: "Ambulatorio", type: "Urgencia", idBed: "-"},
    { code: 7654321, name: "Maria", surname1: "Pérez", surname2: "Castro", phone: 621655788, age: 54, birthdate: new Date("1970-09-12"), status: "Ambulatorio", type: "Urgencia", idBed: "-"}
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