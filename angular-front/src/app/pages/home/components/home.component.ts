import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
  })

export class HomeComponent {
  title = 'MedicaPlus';

  constructor(private translator: TranslateService) {
    this.translator.use('es');
  }
}