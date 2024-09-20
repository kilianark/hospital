import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private url = "https://localhost:7138/api/Patients"


  constructor(private http: HttpClient) { }



  getPatientData (patientCode?: number, Surname1?: string): Observable<PatientInterface[]> {
    let params = new HttpParams();
    if (patientCode != null && patientCode != 0) {
      params = params.set('patientCode', patientCode);
    }
    if (Surname1 != null && Surname1 != undefined && Surname1.trim() !== "") {
      params = params.set('Surname1', Surname1);
    }
    return this.http.get<PatientInterface[]>(this.url, {params});
  }

  getPatientById (patientId: number): Observable<PatientInterface>{  
    return this.http.get<PatientInterface>(this.url + '/' + patientId);
  }

  postPatientData (patient: PatientInterface): Observable<PatientInterface> {
    return this.http.post<PatientInterface>(this.url, patient);
  }

}
