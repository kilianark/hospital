import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // mòdul necessari importat que necessita ngModel

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */

import { CreateService } from './create.service';

import { countries } from '../../shared/store/country-data.store';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePatientComponent {
  public countries:any = countries;

  patient: any = {
    name: '',
    birth: '',
    surname1: '',
    phone: '',
    country: '',
    gender: ''
  };

  constructor(public dialog: MatDialog, private createService: CreateService) {}

  confirm() {
    this.dialog.open(ConfirmComponent, {
    });
  }

  onSubmit() {
    if (this.patient.name && this.patient.birth && this.patient.surname1 && this.patient.phone && this.patient.country && this.patient.gender !== null) {
      this.createService.createPatient(this.patient);
      //this.confirm();
    }
    /*
    if (form.valid) {

      console.log('Paciente registrado:', this.patient);

      //servei exemplar, al cridar-lo, per guardar el pacient
      /*
      this.createService.createPatient(this.patient).subscribe(
        (response: any) => {
          console.log('Paciente creado:', response);
          this.confirm();
        }, 
        (error: any) => {
          console.error('Error al registrar el pacient:', error);
        }
      );
      */
      /*
      if (this.patientForm.form.valid) {
        // Mostrar un pop-up de confirmación
        alert('Paciente registrado exitosamente.');
      }*/
    /*  
    } else {
      console.log('Formulari invàlid, si us plau completa tots els camps requerits.');
    }
    */
  }
}
