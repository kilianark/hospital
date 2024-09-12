import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  private message: string = "";

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>, private router: Router) {}

  setMessage(messageString: string): void {
    this.message = messageString;
  }

  getMessage(): string {
    return this.message;
  }

  closeDialog(): void {
    this.dialogRef.close();
    //this.router.navigate(['/home']);
  }
}
