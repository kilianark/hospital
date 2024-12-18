import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorInterface } from '../../../interfaces/doctor.interface';
import { FormGroup, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-select',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
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
export class DoctorSelectComponent implements OnInit {

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
