import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder } from '@angular/forms';

import { PatientStatus } from '../../../../../enums/patient-status.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
//import { SearchRoomComponent } from '../../room/search/search.component'; // us del component de llista dhabitacions o no?

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManagePatientComponent implements OnInit {
  title = 'Gestionar Estado:'
  patientId: number | undefined;
  patient!: PatientInterface;

  // variables que contindrá els valors seleccionats
  selectedPatientStatus: PatientStatus | null = null;

  // 3 variables mes per guardar area seleccionat segons status***
  selectedAmbulatory: AmbulatoryArea | null = null;
  selectedHospitalized: HospitalizedArea | null = null;
  selectedUrgency: UrgencyArea | null = null;
  selectedOperatingRoom: OperatingRoomArea | null = null;


  // per defecte no mostra l'assignació d'habitacions
  showSelectRoom: boolean = false;

  // por defecto no lista de habitaciones camas-hab
  showRoomList: boolean = false;

  // per defecte no mostra llista d'Arees segons l'estat
  showAreaA: boolean = false;
  showAreaH: boolean = false;
  showAreaU: boolean = false;
  showAreaO: boolean = false;


  // convertim l'enum a una llista d'objectes per fer servir les opcions en el select
  // primer filtrem i després mapegem
  patientStatus = Object.keys(PatientStatus).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: PatientStatus[key as keyof typeof PatientStatus] }));

  // substitueix areaType provisionalment, hauria d'apareixer llistat de tots els arees possibles
  ambulatoryArea = Object.keys(AmbulatoryArea).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: AmbulatoryArea[key as keyof typeof AmbulatoryArea] }));
  // substitueix areaType provisionalment, hauria d'apareixer llistat de tots els arees possibles
  hospitalizedArea = Object.keys(HospitalizedArea).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: HospitalizedArea[key as keyof typeof HospitalizedArea] }));
  // substitueix areaType provisionalment, hauria d'apareixer llistat de tots els arees possibles
  urgencyArea = Object.keys(UrgencyArea).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: UrgencyArea[key as keyof typeof UrgencyArea] }));
  // substitueix areaType provisionalment, hauria d'apareixer llistat de tots els arees possibles
  operatingRoomArea = Object.keys(OperatingRoomArea).filter(key => isNaN(Number(key))).map(key => ({ label: key, value: OperatingRoomArea[key as keyof typeof OperatingRoomArea] }));



  constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder, /*private ORP: OperatingRoomAreaPipe*/) {
    //this.statusForm = this.formBuilder.group({ });
    this.route.params.subscribe(params => {
      this.patientId = +params['id']; // "+" para convertir a número
      this.patientService.getPatientById(this.patientId).subscribe(data =>{
        this.patient = data;
      } )
      // Aquí puedes cargar los datos del paciente con la ID obtenida
    });
  }
  
  ngOnInit(): void {
    
  }

  // canvis d'estat
  // reb el valor de la variable $event, de tipus enum PatientStatus
  onStatusChange(status: PatientStatus) {
    console.log('Estado Seleccionado: ', status);
    this.patient.status = this.selectedPatientStatus;
    console.log(this.patient.status)
    this.patientService.putPatientData(this.patient).subscribe(data => {

    });

    // en cas de que l'estat sigui hospitalitzat mostra llista
    if (status === PatientStatus.Hospitalizado || status === PatientStatus.Ambulatorio || status === PatientStatus.Urgencias || status === PatientStatus.Quirofano) {
      this.showSelectRoom = true;
      if (status === PatientStatus.Ambulatorio) {
        this.showAreaA = true;
        this.showAreaH = false;
        this.showAreaU = false;
        this.showAreaO = false;
      } else if (status === PatientStatus.Hospitalizado) {
        this.showAreaA = false;
        this.showAreaH = true;
        this.showAreaU = false;
        this.showAreaO = false;
      } else if (status === PatientStatus.Urgencias) {
        this.showAreaA = false;
        this.showAreaH = false;
        this.showAreaU = true;
        this.showAreaO = false;
      } else if (status === PatientStatus.Quirofano) {
        this.showAreaA = false;
        this.showAreaH = false;
        this.showAreaU = false;
        this.showAreaO = true;
      }
    } else {
      this.showSelectRoom = false;
    }
  }


  // per cada tipus de selecció d'area, es guarda en la variable corresponent
  // reb el valor de la variable $event, de tipus enum AmbulatoryArea ...
  onAreaChangeA(area: AmbulatoryArea) {
    this.selectedAmbulatory = area;
    console.log('Area Seleccionada: ', area);
  }

  // reb el valor de la variable $event, de tipus enum HospitalizedArea
  onAreaChangeH(area: HospitalizedArea) {
    this.selectedHospitalized = area;
    console.log('Area Seleccionada: ', area);
  }
  
  // reb el valor de la variable $event, de tipus enum UrgencyArea
  onAreaChangeU(area: UrgencyArea) {
    this.selectedUrgency = area;
    console.log('Area Seleccionada: ', area);
  }

  // reb el valor de la variable $event, de tipus enum HospitalizedArea
  onAreaChangeO(area: OperatingRoomArea) {
    this.selectedOperatingRoom = area;
    console.log('Area Seleccionada: ', area);
  }

  
  // para mostrar llista hab y cama:
  showDropDown() {
    this.showRoomList = !this.showRoomList;
  }
  
    // enviament del formulari completat
    onSubmit() {
      //if(this.statusForm.invalid) return;
  
      console.log('Estat Actualitzat:', this.selectedPatientStatus);
      this.confirm();
      this.router.navigate(['/home']);
    }

  // un cop guardat l'estat, informació d'estat de systema/acció
  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage("Estado Actualizado");
  }
}