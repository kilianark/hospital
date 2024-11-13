import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../../../../services/worker.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  doctors: any[] = [];

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.getWorkersByType('doctor').subscribe(data => {
      this.doctors = data;
    });
  }
}
