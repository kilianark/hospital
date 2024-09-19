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
    if (patientCode != null) {
      params = params.set('patientCode', patientCode);
    }
    if (Surname1 != null) {
      params = params.set('Surname1', Surname1);
    }
    return this.http.get<PatientInterface[]>(this.url, {params});
  }
}
