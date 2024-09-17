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

  getPatientData (patientCode?: number): Observable<PatientInterface[]> {
    let params = new HttpParams();
    if (patientCode) {
      params = params.set('patientCode', patientCode)
    }
    return this.http.get<PatientInterface[]>(this.url, {params});
  }
}
