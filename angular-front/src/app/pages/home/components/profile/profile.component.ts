import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component';


import { countries } from '../../../../store/country-data.store';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../interfaces/country.interface';
import { DoctorInterface } from '../../../../interfaces/doctor.interface';
import { DoctorService } from '../../../../services/doctor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  doctorID : number;
  profileForm: FormGroup;
  doctor: DoctorInterface;
  countries : Country[] = countries;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private doctorService : DoctorService, private route: ActivatedRoute) {

    this.profileForm = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: ['', [Validators.required]],
      birth: ['', [Validators.required]],  // Fecha en formato YYYY-MM-DD
      surname1: ['', [Validators.required]],
      surname2: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      username: ['', [Validators.required]],
      address: ['', [Validators.required]],
      speciality: ['', [Validators.required]]
    });

    this.route.params.subscribe((params) => {
      this.doctorID = +params['id'];
      this.doctorService.getDoctorData(this.doctorID).subscribe((data) => {
        this.doctor = data[0];
        this.doctor.birthDate = new Date(this.doctor.birthDate)

        this.profileForm.patchValue({
          ...this.doctor,
          birth: this.doctor.birthDate.toISOString().split('T')[0],
          speciality: this.doctor.worktype + " - " + this.doctor.speciality

        });
      });
    });

  }



  onSubmit() {
    if(this.profileForm.invalid) return;

    console.log('Perfil actualizado');
    this.confirm('Cambios guardados correctamente', 'success');;
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }

}
