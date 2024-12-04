import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { DoctorService } from '../../../../../services/doctor.service';
import { AppointmentService } from '../../../../../services/appointment.service';
import { AppointmentInterface } from '../../../../../interfaces/appointment.interface';

@Component({
  selector: 'app-pool-patients',
  templateUrl: './pool-patients.component.html',
  styleUrl: './pool-patients.component.css'
})
export class PoolPatientsComponent implements OnInit {

  public patients: PatientInterface[] = [];
  private userRoles: string[];

  constructor(
    private patientService: PatientService,
    private keycloakService: KeycloakService,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getKeycloakInstance().realmAccess?.roles;
    var hospitalNum: number = null;

    if(this.userRoles.includes('Goldenfold')) hospitalNum = 1;
    else if (this.userRoles. includes('HospitalFaro')) hospitalNum = 2;

    this.loadPatientsData(hospitalNum);
  }

  loadPatientsData(hospitalNum: number): void {
    this.patientService.getPatientData(null, null, null, null, null, null, null, "4", "6", null, null, hospitalNum).subscribe((data) => {
      this.patients = data;
    });
  }

  assingPatient(patientId: number) {
    //conseguir id del doctor
    var workerCode;

    this.keycloakService.loadUserProfile().then((profile) => {
      workerCode = profile.attributes['workerCode'][0];
      this.doctorService.getDoctorData(workerCode).subscribe((data) => {

        //post a la tabla (no sé si usar appointment o consultation)
        const appointment: AppointmentInterface = {
          id: 0,
          patientId: patientId,
          doctorId: data[0].id,
          appointmentDate: new Date,
          status: '',
          reason: '',
          inUrgencies: true
        };

        this.appointmentService.createAppointment(appointment).subscribe(() => {});
      });
    });
    
    //enrutar al manage del patient
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

}
