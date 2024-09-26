import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorInterface } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})

export class DoctorService {
  private url = "https://localhost:7138/api/Doctor"

  constructor (private http: HttpClient) { }


  getDoctorData() : Observable<DoctorInterface[]> {
    return this.http.get<DoctorInterface[]>(this.url);
  }

  getDoctorById(id: number) : Observable<DoctorInterface> {
    return this.http.get<DoctorInterface>(this.url + '/' + id);
  }

  postDoctorData(doctor: DoctorInterface) : Observable<DoctorInterface> {
    return this.http.post<DoctorInterface>(this.url, doctor);
  }
  
  putDoctorData(doctor: DoctorInterface) : Observable<DoctorInterface> {
    return this.http.put<DoctorInterface>(this.url + '/' + doctor.id, doctor);
  }
}