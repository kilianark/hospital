import { Component, Input, OnInit } from '@angular/core';
import { HospitalService } from '../../../../services/hospital.service';
import { HospitalInterface } from '../../../../interfaces/hospital.interface';
import { ControlValueAccessor } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-hospital-select',
  //standalone: true,
  //imports: [],
  templateUrl: './hospital-select.component.html',
  styleUrl: './hospital-select.component.css'
})
export class HospitalSelectComponent implements OnInit, ControlValueAccessor {
  @Input() isDisabled: boolean = false;
  @Input() hospitalId: number = 0;
  @Input() required: boolean;
  errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.val == 0 && this.registeredTouch
  }

  onChange: any = () => {}
  onTouched: any = () => {}

  registeredTouch : boolean = false;
  val: number = this.hospitalId;

  hospitals: HospitalInterface[] = [];
  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    if (this.hospitalId != 0) this.writeValue(this.hospitalId);
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals
      if (this.hospitals.length == 1) {
        this.writeValue(this.hospitals[0].hospitalCode);
        this.setDisabledState(true);
        //this.patientForm.patchValue({ hospital: this.defaultHospital.hospitalCode })
      }
    });
  }

  set value(val){
    if( val !== undefined && this.val !== val){
    this.val = val
    this.onChange(val)
    this.onTouched(val)
    }
   
  }

  writeValue(value: any){
    this.val = value
  }

  registerOnChange(fn: any){
    this.onChange = fn
  }

  registerOnTouched(fn: any){
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  editTouch() {
    if (!this.registeredTouch) this.registeredTouch = true;
  }

}
