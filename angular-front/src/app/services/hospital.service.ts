import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HospitalInterface } from '../interfaces/hospital.interface';

@Injectable({
    providedIn: 'root'
  })
  
  export class HospitalService {
    private url = ""
  
    constructor (private http: HttpClient) { }

  }
  