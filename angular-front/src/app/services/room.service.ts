import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoomInterface } from '../interfaces/room.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private url = "http://localhost:5124/api/Rooms";

  constructor(private http: HttpClient) { }

  getRoomData (): Observable<RoomInterface[]>{
    return this.http.get<RoomInterface[]>(this.url);
  }

  getRoomById(roomId: number): Observable<RoomInterface>{
    return this.http.get<RoomInterface>(this.url + '/' + roomId );
  }
  getAllRooms(): Observable<RoomInterface[]> {
    return this.getRoomData(); }

  postRoomData (room: RoomInterface): Observable<RoomInterface> {
    return this.http.post<RoomInterface>(this.url, room);
  }

  putRoomData (room: RoomInterface): Observable<RoomInterface> {
    return this.http.put<RoomInterface>(this.url + '/' + room.id, room);
  }

  undoDeleteRoom(roomId : number): Observable<RoomInterface> {
    return this.http.get<RoomInterface>(`${this.url}/undo/${roomId}`);
  }

  deleteRoomData (roomId: number): Observable<RoomInterface> {
    return this.http.delete<RoomInterface>(this.url + '/' + roomId);
  }

  searchRooms(room_number?: number, floor?: number, zone?: number, area?: string, capacity?: number | null, availability?: boolean | null, Hospital?: number[]): Observable<RoomInterface[]> {
    let params = new HttpParams();

    if (Hospital && Hospital.length > 0) {
      Hospital.forEach(h => {
          if (h !== null) {
              params = params.append('Hospital', h);
          }
      });
    }

    if (room_number != null) {
        params = params.set('RoomNumber', room_number.toString());
    }
    if (floor != null) {
        params = params.set('Floor', floor.toString());
    }
    if(zone != null) {
      params = params.set('Zone', zone.toString());
    }
    if (area) {
        params = params.set('Area', area);
    }
    if (capacity != null) {
        params = params.set('Capacity', capacity.toString());
    }
    if (availability != null) {
        params = params.set('Availability', availability.toString());
    }

    return this.http.get<RoomInterface[]>(this.url, { params });
  }

  checkRoomNumberExists(room_number: number, hospital: number): Observable<boolean>{
    let params = new HttpParams()
    if (hospital != null) {
      params = params.set('Hospital', hospital)
    }
    return this.http.get<boolean>(`${this.url}/exists/${room_number}`, { params });
    //this.url + '/exists/' + room_number
  }

}
