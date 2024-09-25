import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-required',
  templateUrl: './required.component.html',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule],
})
export class RequiredComponent {}
