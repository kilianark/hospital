import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RoomInterface } from '../../../interfaces/room.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{
  addRoomForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addRoomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      capacity: ['', Validators.required],
      zone: ['', Validators.required],
      floor: ['', Validators.required],
      availability: [false]
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.addRoomForm.valid) {
      
    }
  }

  resetForm() {
    this.addRoomForm.reset();
  }
}



