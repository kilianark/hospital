import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */
import { Router } from '@angular/router';
import { countries } from '../../../../../store/country-data.store';
import { Country } from '../../../../../interfaces/country.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { VERSION as MAT_VERSION } from '@angular/material/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { CustomValidators } from '../../../../../validators/CustomValidators';
import { AsyncValidators } from '../../../../../validators/AsyncValidators';
import { PatientFormComponent } from '../../../../../shared/components/patient-form/patient-form.component';



console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-create-patient',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreatePatientComponent implements OnInit {
  constructor(private router: Router, public dialog: MatDialog, private patientService: PatientService) { }

  ngOnInit(): void { }

  onFormSubmit(patientData: any) {
    const patient: PatientInterface = {
      ...patientData,
      zone: HospitalZone.Inactivo, // Zona por defecto
      hospital: 'h1',
      bedId: null,
    };

    this.patientService.postPatientData(patient).subscribe(
      (response) => {
        console.log('Paciente registrado:', response);
        this.confirm('Paciente registrado con éxito', 'success');
        this.router.navigate(['/home/patient/manage', { id: response.id }]);
      },
      (error) => {
        this.confirm('Error al registrar paciente. Inténtalo de nuevo.', 'error');
        console.error('Error al registrar el paciente:', error);
      }
    );
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
}
