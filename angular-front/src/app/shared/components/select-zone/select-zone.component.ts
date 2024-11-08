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
  selector: 'app-select-zone',
  standalone: true,
  imports: [SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './select-zone.component.html',
  styleUrl: './select-zone.component.css'
})
export class SelectZoneComponent {

  @Input() zone: AbstractControl;
  getZoneFormControl(): FormControl { return this.zone as FormControl; }

  @Input() showError: boolean = false;

  hospitalZones = Object.keys(HospitalZone)
    .filter((key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone])))
    .map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));
  //

  showSelect: boolean = false;

  constructor(private translator: TranslateService) { }

  ngOnInit(): void {
    this.translator.use('es');

    setTimeout(() => {
      this.showSelect = true;
    }, 1);

  }

}
