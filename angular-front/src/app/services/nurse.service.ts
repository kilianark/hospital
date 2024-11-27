import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { NurseInterface } from '../interfaces/nurse.interface';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private url = "http://localhost:5124/api/Nurse"
  constructor(private http: HttpClient) { }


createNurse(nurse: NurseInterface): Observable<NurseInterface> {
  return this.http.post<NurseInterface>(this.url, nurse);
}
getNurseData(nurseCode? : number): Observable<NurseInterface[]> {
  let params = new HttpParams();
  if (nurseCode != null && nurseCode != undefined && nurseCode != 0) {
    params = params.set('nurseCode', nurseCode);
  }
  return this.http.get<NurseInterface[]>(this.url, { params });
}

getNurseById(nurseCode: number): Observable<NurseInterface> {
return this.http.get<NurseInterface>(this.url + '/' + nurseCode);
}

postNurseData(nurse: NurseInterface): Observable<NurseInterface> {
  return this.http.post<NurseInterface>(this.url, nurse);
}

putNurseData(nurse: NurseInterface): Observable<NurseInterface> {
return this.http.put<NurseInterface>(this.url + '/' + nurse.id, nurse);
}

}
