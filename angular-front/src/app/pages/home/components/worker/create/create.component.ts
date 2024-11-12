import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';  // Componente para mostrar confirmación
import { Router } from '@angular/router';
import { Worker } from '../../../../../interfaces/worker.interface';  // Usamos el nombre correcto aquí
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

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void { }

  // Método que se ejecuta cuando el formulario es enviado
  onFormSubmit(workerData: any) {
    const worker: Worker = {
      ...workerData,
    };

    // Dependiendo del tipo de trabajador (nurse, doctor, administrator), la URL cambiará
    this.workerService.createWorker(worker).subscribe(
      (response) => {
        console.log('Trabajador registrado:', response);
        this.confirm('Trabajador registrado con éxito', 'success');
        this.router.navigate(['/home/worker/manage', { id: response.id }]);  // Redirige a la vista del trabajador
      },
      (error) => {
        this.confirm('Error al registrar trabajador. Inténtalo de nuevo.', 'error');
        console.error('Error al registrar el trabajador:', error);
      }
    );
  }

  // Método para mostrar el mensaje de confirmación
  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);  // Muestra el mensaje de confirmación
  }
}
