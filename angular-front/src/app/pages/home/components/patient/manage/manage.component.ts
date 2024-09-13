import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder } from '@angular/forms';

import { PatientStatus } from '../../../../../enums/patient-status.enum';
// import { StatusType } from '../../../../../enums/ambulatory-area.enum';
import { HospitalzedArea } from '../../../../../enums/hospitalized-area.enum';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { SearchRoomComponent } from '../../room/search/search.component'; // us del component de llista dhabitacions o no?

@Component({
  selector: 'app-manage',
  // standalone: true,
  //imports: [CommonModule],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManagePatientComponent implements OnInit {
  title = 'Gestionar Paciente:'
  patientId: number | undefined;
  
  // variables que contindrá els valors seleccionats
  selectedPatientStatus: PatientStatus | null = PatientStatus.Inactivo ;
  //selectedStatusType: StatusType | null = null;
  selectedAreaType: HospitalzedArea | null = null;

  // per defecte no es mostra llista
  showSelectRoom: boolean = false;

  // por defecto no muestra el form de seleccionar camas-hab
  fakepopup: boolean = false;

  // convertim l'enum a una llista d'objectes per fer servir les opcions en el select
  // primer filtrem i després mapegem
  patientStatus = Object.keys(PatientStatus).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: PatientStatus[key as keyof typeof PatientStatus] }));
  
  // statusType = Object.keys(StatusType).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: StatusType[key as keyof typeof StatusType] }));

  // substitueix areaType provisionalment, hauria d'apareixer llistat de tots els arees possibles
  hospitalizedArea = Object.keys(HospitalzedArea).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: HospitalzedArea[key as keyof typeof HospitalzedArea] }));

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) {
    //this.statusForm = this.formBuilder.group({ });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['id']; // "+" para convertir a número
      console.log('Patient ID:', this.patientId);
      // Aquí puedes cargar los datos del paciente con la ID obtenida
    });
  }

  // canvis d'estat
  onStatusChange(status: PatientStatus) {
    console.log('Estado Seleccionado: ', status);

    // en cas de que l'estat sigui hospitalitzat mostra llista
    if (status === PatientStatus.Hospitalizado || status === PatientStatus.Ambulatorio || status === PatientStatus.Urgencias) {
      this.showSelectRoom = true;
    } else {
      this.showSelectRoom = false;
    }
  }
  /*
  onTypeChange(type: StatusType) {
    this.selectedStatusType = type;
    console.log('Tipo Seleccionado: ', type);
  }*/

  onAreaChange(area: HospitalzedArea) {
    this.selectedAreaType = area;
    console.log('Area Seleccionada: ', area);
  }
  
  onSubmit() {
    //if(this.statusForm.invalid) return;

    console.log('Estat Actualitzat:', this.selectedPatientStatus);
    this.confirm();
    this.router.navigate(['/home']);
  }

  // un cop guardat l'estat
  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage("Datos Actualizados");
  }

  // para mostrar form selección hab y cama:
  showfakepopup() {
    this.fakepopup = !this.fakepopup;
  }
}