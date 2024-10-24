import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BedService } from '../../../../../../services/bed.service';
import { RoomService } from '../../../../../../services/room.service';
import { ConfirmComponent } from '../../../../../../components/confirm/confirm.component';
import { AmbulatoryArea } from '../../../../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../../../../enums/hospitalized-area.enum';
import { OperatingRoomArea } from '../../../../../../enums/operatingRoom-area.enum';
import { UrgencyArea } from '../../../../../../enums/urgency-area.enum';
import { RoomInterface } from '../../../../../../interfaces/room.interface';
import { Observable } from 'rxjs';
import { HospitalZone } from '../../../../../../enums/hospital-zones.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-bed',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponentBed implements OnInit {
  title = 'Crear Cama';
  addBedForm: FormGroup;

  showSelect: boolean = false;

  hospitalZones = Object.keys(HospitalZone)
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
  operatingRoomArea = Object.keys(OperatingRoomArea)
    .filter(
      (key) =>
        !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea]))
    )
    .map((key) => ({
      value: OperatingRoomArea[key as keyof typeof OperatingRoomArea],
    }));
  //
  urgencyArea = Object.keys(UrgencyArea)
    .filter(
      (key) => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea]))
    )
    .map((key) => ({ value: UrgencyArea[key as keyof typeof UrgencyArea] }));
  //

  actualZone: HospitalZone;
  selectedZone:
    | AmbulatoryArea
    | HospitalizedArea
    | UrgencyArea
    | OperatingRoomArea
    | null = null;

  currentArea;
  currentAreaType: string;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    public dialog: MatDialog,
    private translator: TranslateService
  ) {
    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.addBedForm = this.fb.group({
      bedCode: ['', [], [this.roomNumberValidator.bind(this)]],
      roomNumber: ['', [], [this.roomNumberValidator.bind(this)]],
      zone: [this.actualZone],
      area: [{ value: '', disabled: true }],
      availability: [false],
    });
  }

  roomNumberValidator(
    control: AbstractControl
  ): Observable<{ [key: string]: boolean } | null> {
    return this.roomService.checkRoomNumberExists(control.value).pipe(
      debounceTime(500),
      switchMap((exists: boolean) => {
        if (exists) {
          console.log(control.value);
          return this.roomService
            .searchRooms(control.value, null, null, null, null, null)
            .pipe(
              map((data: RoomInterface[]) => {
                console.log(data);
                if (data && data.length > 0) {
                  this.actualZone = data[0].zone;
                  this.currentArea = data[0].area;
                  return null;
                }
                return { roomNumberExists: true };
              }),
              catchError(() => of(null))
            );
        } else {
          return of({ roomNumberExists: true });
        }
      }),
      catchError(() => of(null))
    );
  }

  ngOnInit(): void {}

  onZoneChange(zone: HospitalZone) {
    this.actualZone = zone;
    this.selectedZone = null;

    if (zone != HospitalZone.Inactivo) {
      this.updateArea();
      this.addBedForm.get('area')?.enable();
    }
  }

  updateArea() {
    if (this.actualZone == HospitalZone.Ambulatorio) {
      this.currentArea = this.ambulatoryArea;
      this.currentAreaType = 'AMBULATORY_AREA';
    } else if (this.actualZone == HospitalZone.Hospitalizacion) {
      this.currentArea = this.hospitalizedArea;
      this.currentAreaType = 'HOSPITALIZED_AREA';
    } else if (this.actualZone == HospitalZone.Urgencias) {
      this.currentArea = this.urgencyArea;
      this.currentAreaType = 'URGENCY_AREA';
    } else if (this.actualZone == HospitalZone.Quirofano) {
      this.currentArea = this.operatingRoomArea;
      this.currentAreaType = 'OPERATING_AREA';
    }
  }

  firstNumToFloor() {
    const roomNumberValue = this.addBedForm.get('roomNumber')?.value;

    if (roomNumberValue) {
      const firstNum = parseInt(roomNumberValue.toString().charAt(0));
      if (!isNaN(firstNum)) {
        this.addBedForm.patchValue({ floor: firstNum });
        this.addBedForm.get('floor')?.enable();
      }
    }
  }

  onSubmit() {
    if (this.addBedForm.valid) {
      const roomData: RoomInterface = {
        id: 0,
        roomNumber: this.addBedForm.value.roomNumber,
        capacity: this.addBedForm.value.capacity,
        floor: this.addBedForm.value.floor,
        availability: this.addBedForm.value.availability,
        area: this.addBedForm.value.area,
        zone: this.addBedForm.value.zone,
      };

      console.log('datos hab:', roomData);

      this.roomService.postRoomData(roomData).subscribe({
        next: (data) => {
          this.confirm('Habitación creada con éxito', 'success');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear habitación:', error);
          this.confirm(
            'Error al crear la habitación. Inténtalo de nuevo.',
            'error'
          );
        },
      });
    } else {
      console.warn('El formulario no es válido:', this.addBedForm.errors);
      this.confirm(
        'Error al crear la habitación. Inténtalo de nuevo.',
        'warning'
      );
    }
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }

  resetForm() {
    this.addBedForm.reset();
    this.selectedZone = null;
    this.addBedForm.get('area')?.disable();
  }
}
