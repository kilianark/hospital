import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';

import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { TranslateService } from '@ngx-translate/core';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { RoomService } from '../../../../../services/room.service';
import { AssignRoom } from '../../../../../components/assignroom/assignroom.component';
import { BedInterface } from '../../../../../interfaces/bed.interface';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManagePatientComponent {
  title = 'Gestionar Estado:';
  patientId!: number;
  patient!: PatientInterface;
  zoneForm: FormGroup;

  HospitalZone = HospitalZone;

  selectedZone:
    | AmbulatoryArea
    | HospitalizedArea
    | UrgencyArea
    | OperatingRoomArea
    | null = null;

  currentArea;
  currentAreaType: string;

  showSelectRoom: boolean = false;
  showRoomList: boolean = false;
  beds: BedInterface[] = [];
  bedId!: number;
  rooms: RoomInterface[] = [];

  patientStatus = Object.keys(HospitalZone)
    .filter(
      (key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone]))
    )
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));
  //
  ambulatoryArea = Object.keys(AmbulatoryArea)
    .filter(
      (key) =>
        !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea]))
    )
    .map((key) => ({
      value: AmbulatoryArea[key as keyof typeof AmbulatoryArea],
    }));
  //
  hospitalizedArea = Object.keys(HospitalizedArea)
    .filter(
      (key) =>
        !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea]))
    )
    .map((key) => ({
      value: HospitalizedArea[key as keyof typeof HospitalizedArea],
    }));
  //
  urgencyArea = Object.keys(UrgencyArea)
    .filter(
      (key) => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea]))
    )
    .map((key) => ({ value: UrgencyArea[key as keyof typeof UrgencyArea] }));
  //
  operatingRoomArea = Object.keys(OperatingRoomArea)
    .filter(
      (key) =>
        !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea]))
    )
    .map((key) => ({
      value: OperatingRoomArea[key as keyof typeof OperatingRoomArea],
    }));
  //

  openDialog(roomId: number, patient: PatientInterface) {
    let popupRef = this.dialog.open(AssignRoom, {
      width: '60%',
      height: '80%',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      data: { roomId, patient },
    });

    popupRef.afterClosed().subscribe((updPatient) => {
      console.log("Paciente recibido del popup: ", updPatient);

      this.patient = updPatient;
      console.log("Paciente resultante: ", this.patient);
    });

  }

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private roomService: RoomService
  ) {
    this.translate.use('es');

    this.zoneForm = this.formBuilder.group({
      status: [''],
    });

    this.route.params.subscribe((params) => {
      this.patientId = +params['id'];
      this.patientService.getPatientById(this.patientId).subscribe((data) => {
        this.patient = data;

        this.zoneForm.patchValue({ status: this.patient.zone });
        if (this.patient.zone != HospitalZone.Inactivo)
          this.showSelectRoom = true;

        this.updateArea();
      });
    });
  }

  onStatusChange(zone: HospitalZone) {
    this.patient.zone = zone;
    this.selectedZone = null;

    if (zone != HospitalZone.Inactivo) {
      this.showSelectRoom = true;

      this.updateArea();

      if (this.showRoomList) {
        this.roomService
          .searchRooms(null, null, this.patient.zone, null, null, null)
          .subscribe((data) => (this.rooms = data));
      }
    } else this.showSelectRoom = false;
  }

  updateArea() {
    if (this.patient.zone != HospitalZone.Inactivo) {
      if (this.patient.zone == HospitalZone.Ambulatorio) {
        this.currentArea = this.ambulatoryArea;
        this.currentAreaType = 'AMBULATORY_AREA';
      }  else if (this.patient.zone == HospitalZone.Hospitalizacion) {
        this.currentArea = this.hospitalizedArea;
        this.currentAreaType = 'HOSPITALIZED_AREA';
      }  else if (this.patient.zone == HospitalZone.Urgencias) {
        this.currentArea = this.urgencyArea;
        this.currentAreaType = 'URGENCY_AREA';
      } else if (this.patient.zone == HospitalZone.Quirofano) {
        this.currentArea = this.operatingRoomArea;
        this.currentAreaType = 'OPERATING_AREA';
      }
    }
  }

  onAreaChange(
    area: AmbulatoryArea | HospitalizedArea | UrgencyArea | OperatingRoomArea
  ) {
    if (this.showRoomList) {
      this.roomService
        .searchRooms(null, null, this.patient.zone, area.toString(), null, null)
        .subscribe((data) => (this.rooms = data));
    }
  }

  showDropDown() {
    this.showRoomList = !this.showRoomList;
    if (this.showRoomList) {
      this.roomService
        .searchRooms(null, null, this.patient.zone, null, null, null)
        .subscribe((data) => (this.rooms = data));
    }
  }

  onSubmit() {
    this.patientService.putPatientData(this.patient).subscribe((data) => {});

    console.log('Estat Actualitzat:');
    this.confirm('Paciente actualizado con éxito', 'success');
    this.router.navigate(['/home']);
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
  assignBed(bedId:number){
    this.beds.find((bed)=> bed.id === bedId).availability =false;
    this.patient.bedId=this.bedId;
    console.log('Cama asignada: ');
    this.confirm('Paciente actualizado con éxito', 'success');
    this.router.navigate(['/home']);
  }
  
}
