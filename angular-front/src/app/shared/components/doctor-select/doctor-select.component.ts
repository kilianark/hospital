import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorInterface } from '../../../interfaces/doctor.interface';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


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

  @Input() required: boolean = false;

  public doctors: DoctorInterface[] = [];

  onChange: any = () => {}
  onTouch: any = () => {}
  val: string = "";

  constructor (
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
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
    this.onTouch(val)
    }
   
  }

  writeValue(value: any){
    this.value = value
  }

  registerOnChange(fn: any){
    this.onChange = fn
  }

  registerOnTouched(fn: any){
    this.onTouch = fn
  }
}
