import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../../../../services/worker.service';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent implements OnInit {
  nurses: any[] = [];

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.getWorkersByType('nurse').subscribe(data => {
      this.nurses = data;
    });
  }
}
