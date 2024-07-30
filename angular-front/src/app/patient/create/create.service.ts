import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable ({
    providedIn: 'root'
})
export class CreateService {/*
    private apiUrl = 'https://api.example.com/patients';*/

    constructor(private router: Router/*, private http: HttpClient*/) {}

    createPatient(patient: any) {
        // Lógica de registro del paciente (por ejemplo, llamada a la API)
        console.log('Pacient registrat:', patient);
        
        // Redirigir a la página de confirmación
        this.router.navigate(['/create-patient']);/*
        return this.http.post<any>(this.apiUrl, patient);*/
    }
}