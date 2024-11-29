import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';
import { HospitalService } from '../../../../../services/hospital.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { DoctorService } from '../../../../../services/doctor.service';
import { DoctorInterface } from '../../../../../interfaces/doctor.interface';

@Component({
  selector: 'app-pool-patients',
  templateUrl: './pool-patients.component.html',
  styleUrl: './pool-patients.component.css'
})
export class PoolPatientsComponent implements OnInit {

  public patients: PatientInterface[] = [];
  private hospitals: HospitalInterface[] = [];

  private userRoles: string[];
  public show: boolean = false;

  private doctor: DoctorInterface;
  private doctorID: number;

  constructor(
    private patientService: PatientService,
    private hospitalService: HospitalService,
    private keycloakService: KeycloakService,
    private router: Router,
    private doctorService: DoctorService
  ) {
    
    setTimeout(() => {
      this.show = true;
    }, 1);
    
    this.userRoles = this.keycloakService.getKeycloakInstance().realmAccess?.roles;
    var hospitalNum: number = null;

    if(this.userRoles.includes('Goldenfold')) hospitalNum = 1;
    else if (this.userRoles. includes('HospitalFaro')) hospitalNum = 2;

    console.log(hospitalNum);

    this.loadPatientsData(hospitalNum);
    this.loadHospitalsData();
  }

  ngOnInit(): void {
    
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
    this.patientService.getPatientData(null, null, null, null, null, null, null, "4", "6", null, null, hospitalNum).subscribe((data) => {
      this.patients = data;
      console.log("data:", data);
    });
    
  }

  assingPatient(patientId: number) {
    //conseguir id del doctor
    var workerCode;

    this.keycloakService.loadUserProfile().then((profile) => {
      workerCode = profile.attributes['workerCode'][0];
      console.log(workerCode);
      this.doctorService.getDoctorData(workerCode).subscribe((data) => {
        if(data.length > 0) this.doctor = data[0];
        this.doctorID = this.doctor.id;
      });
    });
    //post a la tabla (no sé si usar appointment o consultation)


    //enrutar al manage del patient
    this.router.navigate(['/home/patient/manage', { id: patientId }]);
  }

}
