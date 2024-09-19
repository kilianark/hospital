import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private url = "https://localhost:7138/api/Patients"

  //temporal hasta que se incremente desde bbdd
  lastId: number = 0;
  lastPatientCode: number = 0;

  constructor(private http: HttpClient) { }

  //temporal hasta que se incremente desde bbdd
  generateNextId(): number {
    return ++this.lastId;
  }
  generateNextPatientCode(): number {
    return ++this.lastPatientCode;
  }

  getPatientData (patientCode?: number, Surname1?: string): Observable<PatientInterface[]> {
    let params = new HttpParams();
    if (patientCode != null) {
      params = params.set('patientCode', patientCode);
    }
    if (Surname1 != null) {
      params = params.set('Surname1', Surname1);
    }
    return this.http.get<PatientInterface[]>(this.url, {params});
  }

  postPatientData (patient: PatientInterface): Observable<PatientInterface[]> {
    
    //temporal hasta que esté conectado a bbdd
    patient.id = this.generateNextId();
    patient.patientCode = this.generateNextPatientCode();

    return this.http.post<PatientInterface[]>(this.url, patient);
  }

}
