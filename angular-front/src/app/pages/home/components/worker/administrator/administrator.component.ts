import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../../../../services/worker.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  administrators: any[] = [];

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.getWorkersByType('administrator').subscribe(data => {
      this.administrators = data;
    });
  }
}
