import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../../interfaces/room.interface';
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
  beds: BedInterface[] = [];
  bedId!: number; // tinc que obtenir els ID beds per la llista de beds
  pacients: PatientInterface[] = [];
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
  
      // Cargar las camas usando el servicio
      this.bedService.getBedData(this.roomId).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
          console.log('Camas obtenidas:', this.beds);
        },
        error => {
          console.error('Error al cargar camas:', error);
        }
      );

      this.roomService.getRoomById(this.roomId).subscribe(data =>{
        this.room = data;
      });
      
      this.patientService.getPatientData(this.bedId).subscribe(data => {
        //this.patient = data;
      })
    }
  }}