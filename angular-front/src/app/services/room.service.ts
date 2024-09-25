import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoomInterface } from '../pages/home/interfaces/room.interface';
import { identity, Observable } from 'rxjs';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private url = "https://localhost:7138/api/Rooms"

  constructor(private http: HttpClient) { }

  getRoomData (roomNumber?: number): Observable<RoomInterface[]>{
    let params = new HttpParams();
    return this.http.get<RoomInterface[]>(this.url, {params});
  }
  getRoomById(Id: number): Observable<RoomInterface>{
    return this.http.get<RoomInterface>(this.url + '/' + Id);
  }
  postRoomData(room: RoomInterface): Observable<RoomInterface>{
    return this.http.put<RoomInterface>(this.url, room);
  }
  
}
