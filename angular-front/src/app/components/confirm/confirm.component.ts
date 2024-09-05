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

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>, private router: Router) {}

  closeDialog(): void {
    this.dialogRef.close();
    //this.router.navigate(['/home']);
  }
}
