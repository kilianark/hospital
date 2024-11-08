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
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { TranslateService } from '@ngx-translate/core';
import { HospitalService } from '../../../../../services/hospital.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  title = 'Crear Habitación';
  addRoomForm: FormGroup;
  hospitals: HospitalInterface[] = [];

  showSelect: boolean = false;

  hospitalZones = Object.keys(HospitalZone)
    .filter((key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone])))
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));
  //
  ambulatoryArea = Object.keys(AmbulatoryArea)
    .filter((key) => !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea])))
    .map((key) => ({ value: AmbulatoryArea[key as keyof typeof AmbulatoryArea] }));
  //
  hospitalizedArea = Object.keys(HospitalizedArea)
    .filter((key) => !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea])))
    .map((key) => ({ value: HospitalizedArea[key as keyof typeof HospitalizedArea] }));
  //
  operatingRoomArea = Object.keys(OperatingRoomArea)
    .filter((key) => !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea])))
    .map((key) => ({ value: OperatingRoomArea[key as keyof typeof OperatingRoomArea] }));
  //
  urgencyArea = Object.keys(UrgencyArea)
    .filter((key) => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea])))
    .map((key) => ({ value: UrgencyArea[key as keyof typeof UrgencyArea] }));
  //
  
  
  actualZone: HospitalZone;
  selectedZone: AmbulatoryArea | HospitalizedArea | UrgencyArea | OperatingRoomArea | null = null;

  currentArea;
  currentAreaType: string;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    public dialog: MatDialog,
    private translator: TranslateService,
    private hospitalService: HospitalService
  ) {

    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.addRoomForm = this.fb.group({
      roomNumber: ['', [ Validators.required], [this.roomNumberValidator.bind(this)]],
      capacity: ['', Validators.required],
      zone: [this.actualZone, Validators.required],
      area: [{ value: '', disabled: true }, Validators.required],

      floor: [{ value: '', disabled: true }, Validators.required],
      availability: [false],
      hospital: ['', Validators.required]
    });
    this.addRoomForm.patchValue({
      zone: HospitalZone.Inactivo
    });
    
  }

  ngOnInit(): void {
    this.loadHospitalsData()
  }

  private loadHospitalsData(): void {
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals.filter(hospital => hospital.hospitalCode !== 0);
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
          this.confirm('Habitación creada con éxito','success');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear habitación:', error);
          this.confirm('Error al crear la habitación. Inténtalo de nuevo.','error');
        }
      });
    } else {
      console.warn('El formulario no es válido:', this.addRoomForm.errors);
      this.confirm('Error al crear la habitación. Inténtalo de nuevo.','warning');
    }
  }

  confirm(message: string,type:string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message,type);
  }

  resetForm() {
    this.addRoomForm.reset();
    this.selectedZone = null;
    this.addRoomForm.get('area')?.disable();
  }

}
