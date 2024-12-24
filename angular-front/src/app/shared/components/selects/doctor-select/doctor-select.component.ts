import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorInterface } from '../../../../interfaces/doctor.interface';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'app-doctor-select',
  //imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './doctor-select.component.html',
  styleUrl: './doctor-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DoctorSelectComponent),
      multi: true,
    }
  ]
})

export class DoctorSelectComponent implements OnInit, ControlValueAccessor {

  @Input() doctorId: number = 0;
  @Input() required: boolean;
  errorStateMatcher: ErrorStateMatcher = {
   isErrorState: () => this.val == 0 && this.registeredTouch && this.required
  }

  public doctors: DoctorInterface[] = [];
  

  onChange: any = () => {}
  onTouched: any = () => {
  }
  registeredTouch : boolean = false;
  val: number = this.doctorId;

  constructor (
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    if (this.doctorId != 0) this.writeValue(this.doctorId);
    console.log(this.val)
  }

  loadDoctors(): void {
    console.log("Loading doctors")
    this.doctorService.getDoctorData().subscribe((data) => {
      this.doctors = data
      console.log(this.doctors)
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

  editTouch() {
    if (!this.registeredTouch) this.registeredTouch = true;
  }
}
