import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */
import { Router } from '@angular/router';
import { WorkerInterface } from '../../../../interfaces/worker.interface';
import { WorkerService } from '../../../../services/worker.service';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { VERSION as MAT_VERSION } from '@angular/material/core';
import { HospitalZone } from '../../../../enums/hospital-zones.enum';
import { WorkerFormComponent } from '../../../../shared/components/worker-form/worker-form.component';

console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private router: Router, public dialog: MatDialog, private workerService: WorkerService) { }

  ngOnInit(): void { }

  onFormSubmit(workerData: any) {
    const worker: WorkerInterface = {
      ...workerData,
      zone: HospitalZone.Inactivo, // Zona por defecto
    };

    this.workerService.createWorker(worker).subscribe(
      (response) => {
        console.log('Trabajador registrado:', response);
        this.confirm('Trabajador registrado con éxito', 'success');
      },
      (error) => {
        this.confirm('Error al registrar trabajador. Inténtalo de nuevo.', 'error');
        console.error('Error al registrar el trabajador:', error);
      }
    );
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
}