import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../interfaces/doctor.interface';
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private url = "http://localhost:5124/api/Doctor"
  constructor (private http: HttpClient) { }
  getDoctorData(doctorCode : number) : Observable<Doctor[]> {
    let params = new HttpParams();
    if (doctorCode != null && doctorCode != undefined && doctorCode != 0) {
      params = params.set('doctorCode', doctorCode);
    }
    return this.http.get<Doctor[]>(this.url, { params });
  }
  getDoctorById(id: number) : Observable<Doctor> {
    return this.http.get<Doctor>(this.url + '/' + id);
  }
  postDoctorData(doctor: Doctor) : Observable<Doctor> {
    return this.http.post<Doctor>(this.url, doctor);
  }
  putDoctorData(doctor: Doctor) : Observable<Doctor> {
    return this.http.put<Doctor>(this.url + '/' + doctor.id, doctor);
  }
}
