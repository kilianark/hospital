import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoomInterface } from '../pages/home/interfaces/room.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private url = "https://localhost:7138/api/Rooms";

  constructor(private http: HttpClient) { }

  searchRooms(room_number: number | null, floor: number | null, area: string, capacity: number | null, availability: boolean | null): Observable<RoomInterface[]> {
    let params = new HttpParams();

    if (room_number !== null) {
        params = params.set('RoomNumber', room_number.toString());
    }
    if (floor !== null) {
        params = params.set('Floor', floor.toString());
    }
    if (area) {
        params = params.set('Area', area);
    }
    if (capacity !== null) {
        params = params.set('Capacity', capacity.toString());
    }
    if (availability !== null) {
        params = params.set('Availability', availability.toString());
    }

    return this.http.get<RoomInterface[]>(this.url, { params });
  }
}