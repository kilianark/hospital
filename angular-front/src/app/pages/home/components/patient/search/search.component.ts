import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patient: PatientInterface[] = [
  ];
 
  constructor(public dialog: MatDialog, private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getPatientData().subscribe(data => {
      this.patient = data;
    })
  }



  openDialog(surname1: string) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog'
      
      
    });
    popupRef.componentInstance.patientSurname = surname1;
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  onSubmit() {
    this.patientService.getPatientData("si", 1).subscribe(data => {
      this.patient = data;
      console.log(data);
    })
  }
}