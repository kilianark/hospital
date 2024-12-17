import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
  patient: PatientInterface;

  // Diccionario que mapea cada cama con su respectivo paciente según el ID de la cama
  patientsMap: { [bedId: number]: PatientInterface | null } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { roomId: number; patient: PatientInterface },

    public dialog: MatDialog,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private bedService: BedService,
    private roomService: RoomService,
    private dialogRef: MatDialogRef<AssignRoom>
  ) {}

  ngOnInit() {
    this.roomId = this.data.roomId;
    this.patient = this.data.patient;

    if (this.roomId) {
      // Cargar datos de la habitación y de las camas
      this.loadRoomData();
      this.loadPatients();
    }
  }

  loadRoomData() {
    this.roomService.getRoomById(this.roomId).subscribe((data) => {
      this.room = data;
    });

    this.bedService.getBedsByRoomId(this.roomId).subscribe((data) => {
      this.beds = data;
    });
  }

  loadPatients() {
    this.patientService.getPatientData().subscribe((patients: PatientInterface[]) => {
        this.patients = patients;
        this.patientService.setPatients(patients); // Configura la lista de pacientes en el servicio
    });
    // Verifica que las camas estén cargadas antes de llamar a `getPatientByBedId`
    if (this.beds.length === 0) {
      console.warn('No se han cargado las camas. Llama a loadBeds() primero.');
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
    const bed = this.beds.find((b) => b.id === bedId);
    if (!bed) {
      alert('Cama no encontrada.');
      return;
    }

    // Actualiza el ID de la cama asignada al paciente
    this.patient.bedId = bedId;
    this.patient.area = this.room.area;
    // Actualiza la disponibilidad de la cama a false
    this.updateBedAvailability(bedId, false);


    // Actualizar los datos del paciente con la nueva cama asignada
    this.patientService.putPatientData(this.patient).subscribe(() => {});

    this.closeDialog();
  }

  // Método para actualizar la disponibilidad de una cama
  updateBedAvailability(bedId: number, isAvailable: boolean) {
    const bed = this.beds.find((b) => b.id === bedId);
    if (!bed) {
      console.error('No se encontró la cama para actualizar disponibilidad.');
      return;
    }

    // Actualizar el estado de disponibilidad
    bed.availability = isAvailable;

    // Enviar la actualización al backend
    this.bedService.putBedData(bed).subscribe(() => {});
    this.closeDialog();
  }


  closeDialog() {
    this.dialogRef.close(this.patient);
  }
}
