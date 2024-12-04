import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { DoctorService } from '../../../../../services/doctor.service';
import { AppointmentService } from '../../../../../services/appointment.service';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.component.html',
  styleUrl: './my-patients.component.css'
})
export class MyPatientsComponent implements OnInit{

  public patients: PatientInterface[] = [];
  private doctorID: number;

  constructor(
    private appointmentService: AppointmentService,
    private keycloakService: KeycloakService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatientsData();
  }

  loadPatientsData(): void {
    var workerCode;

    this.keycloakService.loadUserProfile().then((profile) => {
      workerCode = profile.attributes['workerCode'][0];
      this.doctorService.getDoctorData(workerCode).subscribe((data) => {

        this.doctorID = data[0].id;

        this.appointmentService.getAppointmentData(this.doctorID).subscribe((data) => {

          for(const appointment of data) {

            this.patientService.getPatientById(appointment.patientId).subscribe((data) => { 
              this.patients.push(data); 
            });

          }

        });

      });

    });

  }
}
