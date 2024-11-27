import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';
import { HospitalService } from '../../../../../services/hospital.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-pool-patients',
  templateUrl: './pool-patients.component.html',
  styleUrl: './pool-patients.component.css'
})
export class PoolPatientsComponent implements OnInit {

  public patients: PatientInterface[] = [];
  private hospitals: HospitalInterface[] = [];

  private userRoles: string[];

  constructor(private patientService: PatientService, private hospitalService: HospitalService, private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {

    this.userRoles = this.keycloakService.getKeycloakInstance().realmAccess?.roles;
    var hospitalNum: number = null;

    if(this.userRoles.includes('Goldenfold')) hospitalNum = 1;
    else if (this.userRoles. includes('HospitalFaro')) hospitalNum = 2;

    console.log(hospitalNum);

    this.loadPatientsData(hospitalNum);
    this.loadHospitalsData();
    
  }

  getHospitalName(hospitalCode: number): string {
    const hospital = this.hospitals.find(h => h.hospitalCode === hospitalCode);
    return hospital ? hospital.hospitalName : 'Desconocido';
  }

  loadHospitalsData(): void {
    this.hospitalService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
  }

  loadPatientsData(hospitalNum: number): void {
    this.patientService.getPatientData(null, null, null, null, null, null, null, null, null, null, hospitalNum).subscribe((data) => {
      this.patients = data;
      console.log("data:", data);
    });
    

  }

}
