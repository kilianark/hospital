import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component';
import { Router } from '@angular/router';

import { countries } from '../../store/country-data.store';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-profile',
  //standalone: true,
  //imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  perfilForm: FormGroup;
  constructor(private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.perfilForm = this.formBuilder.group({
      dni: ['', [Validators.required, this.dniValidator]],
      cip: ['', [Validators.pattern(/^\d{8}[A-Z]{2}$/)]],
      name: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['Spain', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

  dniValidator(control: any) {
    const dniPattern = /^\d{8}[A-Z]$/;
    if (!dniPattern.test(control.value)) return {dniInvalid: true};
    return null;
  }

  public countries: Country[] = countries;

  onSubmit() {
    if(this.perfilForm.invalid) return;

    console.log('Pacient registrat:', this.perfilForm.value);
    this.confirm();
    this.router.navigate(['/home']);
  }

  confirm() {
    this.dialog.open(ConfirmComponent, {});
  }

}
