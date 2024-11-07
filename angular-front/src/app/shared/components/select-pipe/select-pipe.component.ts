import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.module';
import { HospitalZone } from '../../../enums/hospital-zones.enum';
import { AmbulatoryArea } from '../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../enums/hospitalized-area.enum';
import { OperatingRoomArea } from '../../../enums/operatingRoom-area.enum';
import { UrgencyArea } from '../../../enums/urgency-area.enum';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-pipe',
  standalone: true,
  imports: [SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './select-pipe.component.html',
  styleUrl: './select-pipe.component.css'
})
export class SelectPipeComponent implements OnInit {

  @Input() zone: AbstractControl;
  getZoneFormControl(): FormControl { return this.zone as FormControl; }

  @Input() area: AbstractControl;
  getAreaFormControl(): FormControl { return this.area as FormControl; }

  @Input() showError: boolean = false;

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

  showSelect: boolean = false;

  constructor(private translator: TranslateService) { }

  ngOnInit(): void {
    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

    this.area.disable();
  }

  onZoneChange(zone: HospitalZone) {
    this.actualZone = zone;
    this.selectedZone = null;

    if (zone != HospitalZone.Inactivo) {
      this.updateArea(zone);
      this.area.setValidators(Validators.required);
      this.area.enable();
    }
    else {
      this.area.reset();
      this.area.clearValidators();
      this.area.disable();
    }
  }

  updateArea(zone: HospitalZone) {
    switch (zone) {
      case HospitalZone.Ambulatorio:
        this.currentArea = this.ambulatoryArea;
        this.currentAreaType = 'AMBULATORY_AREA';
        break;
      case HospitalZone.Hospitalizacion:
        this.currentArea = this.hospitalizedArea;
        this.currentAreaType = 'HOSPITALIZED_AREA';
        break;
      case HospitalZone.Urgencias:
        this.currentArea = this.urgencyArea;
        this.currentAreaType = 'URGENCY_AREA';
        break;
      case HospitalZone.Quirofano:
        this.currentArea = this.operatingRoomArea;
        this.currentAreaType = 'OPERATING_AREA';
        break;
    }
  }
}
