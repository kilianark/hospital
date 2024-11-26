import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component'; /* Missatge que confirma que la petició ha sigut correcte */
import { Router } from '@angular/router';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { WorkerService } from '../../../../../services/worker.service';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { VERSION as MAT_VERSION } from '@angular/material/core';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';


console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-create-worker',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateWorkerComponent implements OnInit {
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