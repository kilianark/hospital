import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

  constructor(private translator: TranslateService) { 
    this.translator.use('es'); 
    console.log(this.translator.instant('PATIENTS'));
  }
}
