import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  standalone: true,
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  private message: string = '';
  private type: string = 'warning'; 

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) {}

  setMessage(messageString: string, type: string = ''): void {
    this.message = messageString;
    this.type = type;
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Cerrar el diálogo automáticamente después de 5 segundos
    setTimeout(() => {
      this.closeDialog();
    }, 2000); // 5 segundos
  }
}
