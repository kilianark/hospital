import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patient: PatientInterface[] = [
  ];

  patientForm: FormGroup;
 
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private patientService: PatientService) {
    this.patientForm = this.formBuilder.group({
      
      name: [''],
      surname1: [''],
      surname2: [''],
      dni: [''],
      cip: [''],
      phone: [''],
      patientCode: ['']
      
    });
  }

  ngOnInit(): void {
    this.patientService.getPatientData().subscribe(data => {
      this.patient = data;
    })
  }

  openDialog(patientCode: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientCode
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  onSubmit() {
    this.patientService.getPatientData(2).subscribe(data => {
      this.patient = data;
    })
  }
}