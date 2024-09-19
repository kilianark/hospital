import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { countries } from '../../../../../store/country-data.store';
import { PatientService } from '../../../../../services/patient.service';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patient: PatientInterface[] = [
    //{ id: 0, patient_code: 1234567, name: "Juan", surname1: "Martínez", surname2: "López", dni: "", cip: "", gender: "", phone: "631238791", email: "", age: 34, birthdate: new Date("1990-09-12"), country: countries[0].name, status: "Ambulatorio", address: "", emergencyContact:""},
    //{ id: 1, patient_code: 7654321, name: "Maria", surname1: "Pérez", surname2: "Castro", dni: "", cip: "", gender: "", phone: "621655788", email: "", age: 54, birthdate: new Date("1970-09-12"), country: countries[0].name, status: "Hospitalizado", address: "", emergencyContact:"", bed_id: 4011}
  ];

  constructor(public dialog: MatDialog, private router: Router, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getPatientData().subscribe(data => {
      this.patient = data;
      console.log(this.patient);
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
  isVisible: boolean=false;
  toggleDisplay(){
    this.isVisible = true;
  }
}