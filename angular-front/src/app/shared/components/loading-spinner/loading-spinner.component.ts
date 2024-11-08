/*import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe, NgIf, NgTemplateOutlet],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent implements OnInit{

  loading$: Observable<boolean>;

  @Input()
  detectedRouteTransitions = false;
  @ContentChild("loading")
  customLoadingService: LoadingService,
  private router: Router){
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(){

  }

}*/
