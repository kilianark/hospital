import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchPatientComponent {
  title = 'Búsqueda Pacientes:';

  patients: PatientInterface[] = [];

  patientForm: FormGroup;

  patientCode: string = ''; //comprovar que se puede convertir en numero
  name: string = '';
  surname1: string = '';
  surname2: string = '';
  dni: string = '';
  cip: string = '';
  phone: string = '';
  ingresados: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private patientService: PatientService,
    private translator: TranslateService
  ) {

    this.translator.use('es');

    this.patientForm = this.formBuilder.group({
      patientCode: [this.patientCode],
      name: [this.name],
      surname1: [this.surname1],
      surname2: [this.surname2],
      dni: [this.dni],
      cip: [this.cip],
      phone: [this.phone],
      ingresados: [this.ingresados],
    });

    this.patientForm.get('patientCode')?.valueChanges.subscribe((value) => {
      this.patientCode = value;
    });

    this.patientForm.get('name')?.valueChanges.subscribe((value) => {
      this.name = value;
    });

    this.patientForm.get('surname1')?.valueChanges.subscribe((value) => {
      this.surname1 = value;
    });

    this.patientForm.get('surname2')?.valueChanges.subscribe((value) => {
      this.surname2 = value;
    });

    this.patientForm.get('dni')?.valueChanges.subscribe((value) => {
      this.dni = value;
    });

    this.patientForm.get('cip')?.valueChanges.subscribe((value) => {
      this.cip = value;
    });

    this.patientForm.get('phone')?.valueChanges.subscribe((value) => {
      this.phone = value;
    });

    this.patientForm.get('ingresados')?.valueChanges.subscribe((value) => {
      this.ingresados = value;
    });
  }

  /*ngOnInit(): void {
    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data;
    });
  }*/

  openDialog(patientCode: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientCode,
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  onSubmit() {
    this.patientService
      .getPatientData(
        Number(this.patientCode),
        this.name,
        this.surname1,
        this.surname2,
        this.dni,
        this.cip,
        this.phone,
        this.ingresados
      )
      .subscribe((data) => {
        this.patients = data;
        console.log(data);
      });
  }
  isVisible: boolean = false;
  toggleDisplay() {
    this.isVisible = true;
  }
}
