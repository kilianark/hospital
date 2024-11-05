import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../interfaces/room.interface';
import { BedInterface } from '../../interfaces/bed.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { BedService } from '../../services/bed.service';
import { PatientService } from '../../services/patient.service';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../../components/recordpatient/record.component';
@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignroom.component.html',
  styleUrls: ['./assignroom.component.css'],
})
export class AssignRoom implements OnInit {
  title = 'Gestión de camas: Habitación ';
  roomId: number;
  room!: RoomInterface;
  beds: BedInterface[] = [];
  bedId!: number; 
  thisIsDisabled: boolean =false;
  patients: PatientInterface[] = [];
  patient!: PatientInterface;


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

      this.roomService.searchRooms(this.roomId).subscribe((data) => {
        this.room = data[0];
      });

      this.bedService.getBedData(this.roomId).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
          console.log('Camas obtenidas:', this.beds);
        },
        (error) => {
          console.error('Error al cargar camas:', error);
        }
      );

      //this.bedService.get

      // orden de paràmetros, bedid no correspon a patientcode
      this.patientService
        .getPatientData(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          this.bedId
        )
        .subscribe(
          (patients: PatientInterface[]) => {
            this.patients = patients;
            console.log('Pacientes obtenido:', this.patient);
          },
          (error) => {
            console.error('Error al cargar paciente:', error);
          }
        )
        if(this.patient!=null){
          this.thisIsDisabled = true;
        };
    }
  }
  // En tu componente .ts
  getPatientByBedId(bedId: number): PatientInterface | null {
    return this.patients.find((patient) => patient.bedId === bedId) || null;
  }
  assignBed(bedId:number){

   }
}
