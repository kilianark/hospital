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



  getPatientData(patientCode?: number, Name?: string, Surname1?: string,
    Surname2?: string, Dni?: string, Cip?: string, Phone?: string, Status?: string, BedId?: number, Ingresados?: boolean): Observable<PatientInterface[]> {
    let params = new HttpParams();
    if (patientCode != null && patientCode != undefined && patientCode != 0) {
      params = params.set('patientCode', patientCode);
    }

    if (Name != null && Name != undefined && Name.trim() !== "") {
      params = params.set('Name', Name);
    }

    if (Surname1 != null && Surname1 != undefined && Surname1.trim() !== "") {
      params = params.set('Surname1', Surname1);
    }

    if (Surname2 != null && Surname2 != undefined && Surname2.trim() !== "") {
      params = params.set('Surname2', Surname2);
    }

    if (Dni != null && Dni != undefined && Dni.trim() !== "") {
      params = params.set('Dni', Dni);
    }

    if (Cip != null && Cip != undefined && Cip.trim() !== "") {
      params = params.set('Cip', Cip);
    }

    if (Phone != null && Phone != undefined && Phone.trim() !== "") {
      params = params.set('Phone', Phone);
    }

    if (Status != null && Status != undefined && Status.trim() !== "") {
      params = params.set('Status', Status);
    }

    if (BedId != null && BedId != 0) {
      params = params.set('BedId', BedId);
    }

    if (Ingresados) {
      params = params.set('Ingresados', Ingresados);
    }

    return this.http.get<PatientInterface[]>(this.url, { params });
  }

  getPatientById(patientId: number): Observable<PatientInterface> {
    return this.http.get<PatientInterface>(this.url + '/' + patientId);
  }

  postPatientData(patient: PatientInterface): Observable<PatientInterface> {
    return this.http.post<PatientInterface>(this.url, patient);
  }

  putPatientData(patient: PatientInterface): Observable<PatientInterface> {
    return this.http.put<PatientInterface>(this.url + '/' + patient.id, patient);
  }



  // Comprovaciones de campos especificos
  checkDniExists(dni: string): Observable<boolean> {
    const url = `${this.url}?Dni=${dni}`;
    return this.http.get<boolean>(url);
  }

}
