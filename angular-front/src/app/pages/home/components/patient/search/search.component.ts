import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchPatientComponent implements OnInit {
  title = 'Búsqueda Pacientes:';

  patients: PatientInterface[] = [];
  filteredPatients: PatientInterface[] = [];
  fuseName: Fuse<PatientInterface> | null = null;
  fuseSurname1: Fuse<PatientInterface> | null = null;
  fuseSurname2: Fuse<PatientInterface> | null = null;

  patientForm: FormGroup;

  patientCode: string = '';
  name: string = '';
  surname1: string = '';
  surname2: string = '';
  dni: string = '';
  cip: string = '';
  phone: string = '';
  status: string = '';
  bedId: number = 0;

  showSelect: boolean = false;

  patientStatus = Object.keys(HospitalZone)
    .filter(
      (key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone]))
    )
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private patientService: PatientService,
    private translator: TranslateService
  ) {

    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.patientForm = this.formBuilder.group({
      status: [null],
      patientCode: [this.patientCode],
      name: [this.name],
      surname1: [this.surname1],
      surname2: [this.surname2],
      dni: [this.dni],
      cip: [this.cip],
      phone: [this.phone],
    });


    this.patientForm.valueChanges.subscribe((formValues) => {
      this.patientCode = formValues.patientCode;
      this.name = formValues.name;
      this.surname1 = formValues.surname1;
      this.surname2 = formValues.surname2;
      this.dni = formValues.dni;
      this.cip = formValues.cip;
      this.phone = formValues.phone;
    });
  }

  ngOnInit(): void {
    this.patientService.getPatientData().subscribe((data) => {
      this.patients = data.map (patient => ({
        ...patient,
        status: patient.zone
      }));
      this.filteredPatients = this.patients;

      this.fuseName = new Fuse(this.patients, {
        keys: ['name'],
        threshold: 0.3,
      });

      this.fuseSurname1 = new Fuse(this.patients, {
        keys: ['surname1'],
        threshold: 0.3,
      });

      this.fuseSurname2 = new Fuse(this.patients, {
        keys: ['surname2'],
        threshold: 0.3,
      });

    });
  }


  searchPatients() {
    //campos fuzzy
    const name = this.patientForm.get('name')?.value || '';
    const surname1 = this.patientForm.get('surname1')?.value || '';
    const surname2 = this.patientForm.get('surname2')?.value || '';

    //campos búsqueda exacta:
    const dni = this.patientForm.get('dni')?.value || '';
    const cip = this.patientForm.get('cip')?.value || '';
    const patientCode = this.patientForm.get('patientCode')?.value || '';
    const phone = this.patientForm.get('phone')?.value || '';
    const status = this.patientForm.get('status')?.value || '';

    let exactFilteredPatients = this.patients;

    if (dni) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.dni) === (dni));
    }

    if (cip) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.cip) === (cip));
    }

    if (phone) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.phone) === (phone));
    }

    if (patientCode) {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.patientCode) === patientCode);
    }

    if (status && status !== '') {
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        String(patient.zone) === String(status));//antes en number tenía string e iba. tb tengo string antes de patient.zone 
    }

    //campos búsqueda fuzzy:

    if (this.fuseName && name) {
      const fuzzyResultsName = this.fuseName.search(name);
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        fuzzyResultsName.some((result) => result.item === patient)
      );
    }

    if (this.fuseSurname1 && surname1) {
      const fuzzyResultsSurname1 = this.fuseSurname1.search(surname1);
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        fuzzyResultsSurname1.some((result) => result.item === patient)
      );
    }

    if (this.fuseSurname2 && surname2) {
      const fuzzyResultsSurname2 = this.fuseSurname2.search(surname2);
      exactFilteredPatients = exactFilteredPatients.filter((patient) =>
        fuzzyResultsSurname2.some((result) => result.item === patient)
      );
    }

    this.filteredPatients = exactFilteredPatients;
    this.isVisible = true;
  }

  openDialog(patientId: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientId,
    });
  }

  goToManage(patientId: number) {
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

  onSubmit() {
    this.searchPatients();
  }

  resetForm() {
    this.patientForm.reset();
    this.isVisible = false;
  }

  isVisible: boolean = false;
  toggleDisplay() {
    this.isVisible = true;
  }
}
