
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
  styleUrls: ['./my-patients.component.css']
})
export class MyPatientsComponent implements OnInit {

  public patients: PatientInterface[] = [];
  private doctorID!: number;
  public isDataLoaded = false;


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
    let workerCode: string;

    this.keycloakService.loadUserProfile().then((profile) => {
      workerCode = profile.attributes['workerCode'][0];
      this.doctorService.getDoctorData(parseInt(workerCode)).subscribe((doctorData) => {
        this.doctorID = doctorData[0].id;

        this.appointmentService.getAppointmentData(this.doctorID).subscribe((appointments) => {
          const uniquePatientIds = new Set<number>();
          for (const appointment of appointments) {
            if (!uniquePatientIds.has(appointment.patientId)) {
              uniquePatientIds.add(appointment.patientId);

              this.patientService.getPatientById(appointment.patientId).subscribe((patient) => {
                this.patients.push(patient);
              });
            }
          }
          this.isDataLoaded = true; // Marcar como datos cargados
        });
      });
    });
  }


  goToMedicalEpisode(patientId: number): void {
    this.router.navigate(['/home/patient/medical_episode', { id: patientId }]);
  }
}
