import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { BedInterface } from '../../../../../interfaces/bed.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../../../services/room.service';
import { BedService } from '../../../../../services/bed.service';
import { PatientService } from '../../../../../services/patient.service';

import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';
@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrl: './bed.component.css'
})
export class BedComponent implements OnInit {
  title = 'Gestión de camas: Habitación ';
  // id rebut -> obté valor per route
  roomId: number | null = null;  
  // data per convenció reb l'instància (RoomInf)
  room!: RoomInterface;
  // obtenim tot el llistar d'interfaces de llit
  beds: BedInterface[] = [];
  // obtenim el bedId desde el bedService
  bedId!: number; // tinc que obtenir els ID beds per la llista de beds

  // contindrà llista d'interface de pacients
  patients: PatientInterface[] = [];
  patient!: PatientInterface;

  // quan rebem una data interface de paciente d'allà obtenim, id, nomSur, i el codiPatient. 
  

  constructor(
      public dialog: MatDialog, 
      private route: ActivatedRoute, 
      private patientService: PatientService,
      private bedService: BedService, 
      private roomService: RoomService
    ) {}

  openDialog(patientCode: number) {
    let popupRef = this.dialog.open(RecordComponent, {
      width: '80%',
      height: '100%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: patientCode,
    });
  }

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
  
    if (this.roomId) {
      console.log('ID de la habitación:', this.roomId);
      
      this.roomService.getRoomById(this.roomId).subscribe(data =>{
        this.room = data;
      });
  
      // Cargar las camas usando el servicio, filtrando por idRoom, no posem disponibilitat perquè volem mostrar tots els llits
      this.bedService.getBedData(this.roomId).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
          console.log('Camas obtenidas:', this.beds);
        },
        error => {
          console.error('Error al cargar camas:', error);
        }
      );

      //this.bedService.get

      // orden de paràmetros, bedid no correspon a patientcode
      this.patientService.getPatientData(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.bedId)
      .subscribe(
        (patients: PatientInterface[]) => {
            this.patients = patients;
            console.log('Pacientes obtenido:', this.patient);
        },
        error => {
            console.error('Error al cargar paciente:', error);
        }
      );
    }
  };
  // En tu componente .ts
  getPatientByBedId(bedId: number): PatientInterface | null {
    return this.patients.find(patient => patient.bedId === bedId) || null;
  }
}

  