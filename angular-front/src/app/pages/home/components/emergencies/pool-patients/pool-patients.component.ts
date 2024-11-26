import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { HospitalInterface } from '../../../../../interfaces/hospital.interface';

@Component({
  selector: 'app-pool-patients',
  templateUrl: './pool-patients.component.html',
  styleUrl: './pool-patients.component.css'
})
export class PoolPatientsComponent implements OnInit {

  patients: PatientInterface[] = [];
  hospitals: HospitalInterface[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
      this.patientService.getPatientData().subscribe((data) => {
        this.patients = data;
      })
  }

  getHospitalName(hospitalCode: number): string {
    const hospital = this.hospitals.find(h => h.hospitalCode === hospitalCode);
    return hospital ? hospital.hospitalName : 'Desconocido';
  }

}
