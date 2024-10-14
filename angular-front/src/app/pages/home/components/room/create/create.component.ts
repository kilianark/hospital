import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RoomService } from '../../../../../services/room.service';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { debounceTime, map, Observable } from 'rxjs';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  title = 'Crear Habitación';
  addRoomForm: FormGroup;

  ambulatoryAreas = Object.keys(AmbulatoryArea)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ value: key, name: key }));

  hospitalizedAreas = Object.keys(HospitalizedArea)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ value: key, name: key }));

  operatingRoomAreas = Object.keys(OperatingRoomArea)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ value: key, name: key }));

  urgencyAreas = Object.keys(UrgencyArea)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ value: key, name: key }));

  selectedZone: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.addRoomForm = this.fb.group({
      roomNumber: ['', [ Validators.required], [this.roomNumberValidator.bind(this)]],
      capacity: ['', Validators.required],
      zone: ['', Validators.required],
      area: [{ value: '', disabled: true }, Validators.required],
      floor: [{ value: '', disabled: true }, Validators.required],
      availability: [false]
    });
  }

  roomNumberValidator(control: AbstractControl): Observable<{ [key:string]: boolean } | null > {

    return this.roomService.checkRoomNumberExists(control.value).pipe(
      debounceTime(500),
      map((exists: boolean) => {
        return exists ? { roomExists: true} : null;
      })
    );
  }

  ngOnInit(): void {}

  onZoneChange(event: any) {
    const zoneValue = event.value;
  
    this.selectedZone = zoneValue;
  
    if (zoneValue) {
      this.addRoomForm.get('area')?.enable();
    } else {
      this.addRoomForm.get('area')?.disable();
    }

    this.addRoomForm.get('roomNumber')?.statusChanges.subscribe(status => {
      console.log('Estado de roomNumber:', status);
      console.log('Errores de roomNumber:', this.addRoomForm.get('roomNumber')?.errors);
    });


  }

  firstNumToFloor() {
    const roomNumberValue = this.addRoomForm.get('roomNumber')?.value;

    if (roomNumberValue) {
      const firstNum = parseInt(roomNumberValue.toString().charAt(0));
      if (!isNaN(firstNum)) {
        this.addRoomForm.patchValue({ floor: firstNum });
        this.addRoomForm.get('floor')?.enable();
      }
    }
  }

  onSubmit() {
    if (this.addRoomForm.valid) {
      const roomData: RoomInterface = {
        id: 0,
        roomNumber: this.addRoomForm.value.roomNumber,
        capacity: this.addRoomForm.value.capacity,
        floor: this.addRoomForm.value.floor,
        availability: this.addRoomForm.value.availability,
        area: this.addRoomForm.value.area,
        zone: this.addRoomForm.value.zone,
      };

      console.log('datos hab:', roomData);

      this.roomService.postRoomData(roomData).subscribe({
        next: (data) => {
          this.confirm('Habitación creada con éxito');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear habitación:', error);
          this.confirm('Error al crear la habitación. Inténtalo de nuevo.');
        }
      });
    } else {
      console.warn('El formulario no es válido:', this.addRoomForm.errors);
    }
  }

  confirm(message: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message);
  }

  resetForm() {
    this.addRoomForm.reset();
    this.selectedZone = null;
    this.addRoomForm.get('area')?.disable();
  }

  getAreasByZone(): Array<{ value: string, name: string }> {
    switch (this.selectedZone) {
      case 'Ambulatorio':
        return this.ambulatoryAreas;
      case 'Hospitalizado':
        return this.hospitalizedAreas;
      case 'Quirofano':
        return this.operatingRoomAreas;
      case 'Urgencias':
        return this.urgencyAreas;
      default:
        return [];
    }
  }
}