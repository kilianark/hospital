import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorInterface } from '../interfaces/doctor.interface';
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private url = "http://localhost:5124/api/Doctor"
  constructor (private http: HttpClient) { }



  createDoctor(doctor: DoctorInterface): Observable<DoctorInterface> {
    return this.http.post<DoctorInterface>(this.url, doctor);
  }
  getDoctorData(doctorCode? : number) : Observable<DoctorInterface[]> {
    let params = new HttpParams();
    if (doctorCode != null && doctorCode != undefined && doctorCode != 0) {
      params = params.set('doctorCode', doctorCode);
    }
    return this.http.get<DoctorInterface[]>(this.url, { params });
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
