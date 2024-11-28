
import { Administrator } from '../interfaces/administrator.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = "http://localhost:5124/api/Administrator";

  constructor(private http: HttpClient) { }

  createAdmin(admin: Administrator): Observable<Administrator> {
    return this.http.post<Administrator>(this.url, admin);
  }

  getAdminData(adminCode?: number): Observable<Administrator[]> {
    let params = new HttpParams();
    if (adminCode != null && adminCode !== undefined && adminCode !== 0) {
      params = params.set('adminCode', adminCode);
    }
    return this.http.get<Administrator[]>(this.url, { params });
  }

  getAdminById(adminCode: number): Observable<Administrator> {
    return this.http.get<Administrator>(`${this.url}/${adminCode}`);
  }

  postAdminData(admin: Administrator): Observable<Administrator> {
    return this.http.post<Administrator>(this.url, admin);
  }

  putAdminData(admin: Administrator): Observable<Administrator> {
    return this.http.put<Administrator>(`${this.url}/${admin.id}`, admin);
  }
}
