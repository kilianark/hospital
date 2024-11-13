import { Component, OnInit, Inject } from '@angular/core';
import { RoomInterface } from '../../interfaces/room.interface';
import { BedInterface } from '../../interfaces/bed.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { BedService } from '../../services/bed.service';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './assignroom.component.html',
  styleUrls: ['./assignroom.component.css'],
})
export class AssignRoom implements OnInit {
  title = 'Gestión de camas: Habitación ';
  roomId: number;
  room!: RoomInterface;
  beds: BedInterface[] = [];
  thisIsDisabled: boolean = false;
  patients: PatientInterface[] = [];
  patient!: PatientInterface;

  // Diccionario que mapea cada cama con su respectivo paciente según el ID de la cama
  patientsMap: { [bedId: number]: PatientInterface | null } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private bedService: BedService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.roomId = this.data;

    if (this.roomId) {
      console.log('Id de la habitación:', this.roomId);

      // Cargar datos de la habitación y de las camas
      this.loadRoomData();
      this.loadPatients();
    }
  }

  loadRoomData() {
    this.roomService.searchRooms(this.roomId).subscribe((data) => {
      this.room = data[0];
    });

    this.bedService.getBedsByRoomId(this.roomId).subscribe((data) => {
      this.beds = data;
      console.log('Camas obtenidas:', this.beds);
    });
  }

  loadPatients() {
    // Verifica que las camas estén cargadas antes de llamar a `getPatientByBedId`
    if (this.beds.length === 0) {
      console.warn("No se han cargado las camas. Llama a loadBeds() primero.");
      return;
    }

    // Itera sobre cada cama para obtener el paciente asociado usando `getPatientByBedId`
    this.beds.forEach((bed) => {
      this.patientService.getPatientByBedId(bed.id).subscribe((patient) => {
        if (patient) {
          // Añade el paciente al mapa `patientsMap` usando bedId como clave
          this.patientsMap[bed.id] = patient;
        } else {
          // Si no hay paciente asignado, puedes almacenar un valor nulo o un marcador de "Sin paciente"
          this.patientsMap[bed.id] = null;
        }
      });
    });
  }



  // Obtiene un paciente según el ID de la cama
  getPatientByBedId(bedId: number): Observable<PatientInterface | null> {
    return this.patientService.getPatientByBedId(bedId);
  }

  assignBed(bedId: number) {
    // lógica para asignar cama
  }

}
