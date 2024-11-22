import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BedInterface } from '../interfaces/bed.interface';

@Injectable({
  providedIn: 'root'
})
export class BedService {
  private url = "http://localhost:5124/api/Beds"


  constructor(private http: HttpClient) { }

  getBedData(roomId?: number, Availability?: boolean) : Observable<BedInterface[]> {
    let params = new HttpParams();
    if (roomId != null && roomId != 0) {
      params = params.set('roomId', roomId)
    }
    if (Availability != null) {
        params = params.set('Availability', Availability)
    }
    return this.http.get<BedInterface[]>(this.url, {params});
  }
  putBedData(bed: BedInterface): Observable<BedInterface> {
    return this.http.put<BedInterface>(`${this.url}/${bed.id}`, bed);
  }
  getBedDataById(bedId: number) : Observable<BedInterface> {
    return this.http.get<BedInterface>(this.url + '/' + bedId);
  }

  postBedData(bed: BedInterface) : Observable<BedInterface> {
    return this.http.post<BedInterface>(this.url, bed);
  }

  getBedsByRoomId(roomId: number): Observable<BedInterface[]> {
    let params = new HttpParams();
    if (roomId != null && roomId != 0) {
      params = params.set('roomId', roomId)
    }
    return this.http.get<BedInterface[]>(this.url, {params});
  }
  deleteBed(bedId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${bedId}`);
  }
  updateBedAvailability(bedId: number, isAvailable: boolean): Observable<void> {
    return this.http.put<void>(`${this.url}/${bedId}`, { availability: isAvailable });
  }



}
