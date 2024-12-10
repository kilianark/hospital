import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HospitalInterface } from '../interfaces/hospital.interface';

@Injectable({
    providedIn: 'root'
})

export class HospitalService {
    private apiUrl = "http://localhost:5124/api/Hospital"
    constructor(private http: HttpClient) { }

    // Método para obtener la lista de hospitales con filtros opcionales
    getHospitals(Hospital?: number, hospitalName?: string): Observable<HospitalInterface[]> {
        let params = new HttpParams();

        if (Hospital) {
            params = params.set('Hospital', Hospital.toString());
        }
        if (hospitalName) {
            params = params.set('hospitalName', hospitalName);
        }

        return this.http.get<HospitalInterface[]>(this.apiUrl, { params });
    }

    // Método para obtener un hospital por ID
    getHospitalById(id: number): Observable<HospitalInterface> {
        return this.http.get<HospitalInterface>(`${this.apiUrl}/${id}`);
    }

    getHospitalNameByCode(Hospital: number): Observable<string> {
        return this.http.get<HospitalInterface>(`${this.apiUrl}/${Hospital}`)
            .pipe(
                map(hospital => hospital.hospitalName || 'Desconocido')
            );
    }

    // Método para agregar un nuevo hospital
    addHospital(hospital: HospitalInterface): Observable<HospitalInterface> {
        return this.http.post<HospitalInterface>(this.apiUrl, hospital);
    }

    // Método para actualizar un hospital existente
    updateHospital(id: number, hospital: HospitalInterface): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, hospital);
    }

    // Método para eliminar un hospital
    deleteHospital(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
