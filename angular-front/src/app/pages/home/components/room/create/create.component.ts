import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RoomService } from '../../../../../services/room.service';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { RoomInterface } from '../../../interfaces/room.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  title = 'Crear Habitación';
  addRoomForm: FormGroup;

  ambulatoryAreas = Object.keys(AmbulatoryArea)
    .filter(key => !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea])))
    .map(key => ({ value: AmbulatoryArea[key as keyof typeof AmbulatoryArea], name: key }));

  hospitalizedAreas = Object.keys(HospitalizedArea)
    .filter(key => !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea])))
    .map(key => ({ value: HospitalizedArea[key as keyof typeof HospitalizedArea], name: key }));

  operatingRoomAreas = Object.keys(OperatingRoomArea)
    .filter(key => !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea])))
    .map(key => ({ value: OperatingRoomArea[key as keyof typeof OperatingRoomArea], name: key }));

  urgencyAreas = Object.keys(UrgencyArea)
    .filter(key => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea])))
    .map(key => ({ value: UrgencyArea[key as keyof typeof UrgencyArea], name: key }));

  selectedZone: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.addRoomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      capacity: ['', Validators.required],
      zone: ['', Validators.required],
      area: [{ value: '', disabled: true }, Validators.required],
      floor: [{ value: '', disabled: true }, Validators.required],
      availability: [false]
    });
  }

  ngOnInit(): void {}

  onZoneChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;  
    const zoneValue = selectElement.value;  

    this.selectedZone = zoneValue;

    if (zoneValue) {
      this.addRoomForm.get('area')?.enable();
    } else {
      this.addRoomForm.get('area')?.disable();
    }
  }

  firstNumToFloor() {
    const roomNumberValue = this.addRoomForm.get('roomNumber')?.value;
    const firstNum = roomNumberValue.toString().charAt(0);
    this.addRoomForm.patchValue({ floor: firstNum });
  }

  onSubmit() {
    if (this.addRoomForm.valid) {
      const roomData: RoomInterface = {
        id: 0,
        roomNumber: this.addRoomForm.value.roomNumber,
        capacity: this.addRoomForm.value.capacity,
        floor: this.addRoomForm.value.floor, 
        availability: this.addRoomForm.value.availability,
        area: this.addRoomForm.value.area
      };
  
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

  getAreasByZone(): Array<{ value: any, name: string }> {
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