import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/modules/material.module';
import { PatientService } from '../../services/patient.service';
import { PatientInterface } from '../../interfaces/patient.interface';
import { RoomInterface } from '../../interfaces/room.interface';
import { RoomService } from '../../services/room.service';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  imports: [MaterialModule, CommonModule],
  standalone: true,
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  public undoButton: boolean = false;
  private message: string = '';
  private type: string = 'warning'; 

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { idObjectEliminated: number ; type: string},

    public dialogRef: MatDialogRef<ConfirmComponent>, 
    private patientService: PatientService,
    private roomService : RoomService,
    private workerService : WorkerService) {}

  setMessage(messageString: string, type: string = ''): void {
    this.message = messageString;
    this.type = type;
    if (this.data.idObjectEliminated != null) {
      this.setUndoButton(true);
    }
  }

  getMessage(): string {
    return this.message;
  }

  getType(): string {
    return this.type;
  }

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return '✔'; // Icono de éxito
      case 'error':
        return '✖'; // Icono de error
      case 'warning':
        default:
          return '⚠'; // Icono de advertencia
       // Icono de información
    }
  }

  setUndoButton(undo: boolean): void {
    this.undoButton = undo;
  }

  

  undo(): void {
    console.log("undo: ", this.data.idObjectEliminated);
    if (this.data.type == "room") {
      console.log("Type room");
      this.roomService.undoDeleteRoom(this.data.idObjectEliminated).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
    if (this.data.type == "patient") {
      console.log("Type patient");
      this.patientService.undoDeletePatient(this.data.idObjectEliminated).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
    if (this.data.type == "worker") {
      this.workerService.undoDeletePatient(this.data.idObjectEliminated).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    // Cerrar el diálogo automáticamente después de 5 segundos
    setTimeout(() => {
      this.closeDialog();
    }, 2000); // 5 segundos
  }
}
