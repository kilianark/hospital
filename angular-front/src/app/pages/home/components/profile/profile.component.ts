import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component';
import { Router } from '@angular/router';

import { countries } from '../../../../store/country-data.store';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../../interfaces/country.interface';

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
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      name: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.email]],
      country: ['Spain', [Validators.required]],
      gender: ['', [Validators.required]],
      user: ['', [Validators.required]]
    });
  }

  public countries: Country[] = countries;

  onSubmit() {
    if(this.perfilForm.invalid) return;

    console.log('Perfil actualizado');
    this.confirm();
  }

  confirm() {
    let dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage("Perfil Actualizado")
  }

}
