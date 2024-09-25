import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BedInterface } from '../interfaces/bed.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private url = "https://localhost:7138/api/Beds"


  constructor(private http: HttpClient) { }

  getBedData(Availability?: boolean) : Observable<BedInterface[]> {
    let params = new HttpParams(); 
    if (Availability != null) {
        params = params.set('Availability', Availability)
    }
    return this.http.get<BedInterface[]>(this.url, {params});
  }

  getBedDataById(bedId: number) : Observable<BedInterface> {
    return this.http.get<BedInterface>(this.url + '/' + bedId);
  }

  postBedData(bed: BedInterface) : Observable<BedInterface> {
    return this.http.post<BedInterface>(this.url, bed);
  }
}