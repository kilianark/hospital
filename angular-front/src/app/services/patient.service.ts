import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private url = "http://localhost:5124/api/Patients"
  patients: PatientInterface[] = [];

  constructor(private http: HttpClient) { }
  setPatients(patients: PatientInterface[]) {
    this.patients = patients;
  }


  getPatientByBedId(bedId: number): Observable<PatientInterface | null> {
    const patient = this.patients.find(patient => patient.bedId === bedId) || null;
    return of(patient); // Retorna un Observable para seguir con el patrón de suscripción
  }
  getPatientData(patientCode?: number, Name?: string, Surname1?: string,
    Surname2?: string, Dni?: string, Cip?: string, Phone?: string, Status?: string, BedId?: number, Ingresados?: boolean, Hospital?: string[]): Observable<PatientInterface[]> {

    let params = new HttpParams();

    if (patientCode != null && patientCode != undefined && patientCode != 0) {
      params = params.set('patientCode', patientCode);
    }

    if (Name != null && Name != undefined && Name.trim() !== "") {
      params = params.set('Name', Name);
    }

    if (Surname1 != null && Surname1 != undefined && Surname1.trim() !== "") {
      params = params.set('Surname1', Surname1);
    }

    if (Surname2 != null && Surname2 != undefined && Surname2.trim() !== "") {
      params = params.set('Surname2', Surname2);
    }

    if (Dni != null && Dni != undefined && Dni.trim() !== "") {
      params = params.set('Dni', Dni);
    }

    if (Cip != null && Cip != undefined && Cip.trim() !== "") {
      params = params.set('Cip', Cip);
    }

    if (Phone != null && Phone != undefined && Phone.trim() !== "") {
      params = params.set('Phone', Phone);
    }

    if (Status != null && Status != undefined && Status.trim() !== "") {
      params = params.set('Status', Status);
    }

    if (BedId != null && BedId != 0) {
      params = params.set('BedId', BedId);
    }

    if (Ingresados) {
      params = params.set('Ingresados', Ingresados);
    }

    if (Hospital && Hospital.length > 0) {
      Hospital.forEach(h => {
          if (h.trim() !== "") {
              params = params.append('Hospital', h.trim());
          }
      });
  }


    return this.http.get<PatientInterface[]>(this.url, { params });
  }

  getPatientById(patientId: number): Observable<PatientInterface> {
    return this.http.get<PatientInterface>(this.url + '/' + patientId);
  }

  postPatientData(patient: PatientInterface): Observable<PatientInterface> {
    return this.http.post<PatientInterface>(this.url, patient);
  }

  putPatientData(patient: PatientInterface): Observable<PatientInterface> {
    return this.http.put<PatientInterface>(`${this.url}/${patient.id}`, patient); // Correcta inclusión de ID
  }

  undoDeletePatient(patient : PatientInterface): Observable<PatientInterface> {
    return this.http.get<PatientInterface>(`${this.url}/undo/${patient.id}`);
  }

  deletePatientData(patientId: number): Observable<PatientInterface> {
    return this.http.delete<PatientInterface>(`${this.url}/${patientId}`);
  }

  // Obtener el proximo patientCode
  getNextPatientCode(): Observable<number> {
    return this.getPatientData().pipe(
      map(patients => {
        if (patients && patients.length > 0) {
          // Obtener el último paciente ordenado por código (asegurarse de que 'patientCode' sea un número)
          const lastPatient = patients.sort((a, b) => b.patientCode - a.patientCode)[0];
          // Retornar el próximo código de paciente
          return lastPatient ? lastPatient.patientCode + 1 : 1;  // Incrementar el último código
        } else {
          return 1;  // Si no hay pacientes, empieza por 1
        }
      })
    );
  }



  // Comprovaciones de campos especificos
  checkDniExists(dni: string, excludePatientCode?: number): Observable<boolean> {
    const url = `${this.url}`;  // Asegúrate de que esta URL esté correctamente apuntando al endpoint de pacientes
    return this.http.get<PatientInterface[]>(url, { params: { dni } }).pipe(
      map(patients => {

        if (excludePatientCode) {
          // Filtrar el paciente actual si se proporciona un código
          patients = patients.filter(p => p.patientCode !== excludePatientCode);
        }
        return patients.length > 0;  // Si queda algún paciente con ese DNI, el DNI ya existe
      }),
      catchError(() => of(false))  // En caso de error, retornamos que no existe para no bloquear la validación
    );
  }

  checkCipExists(cip: string, excludePatientCode: number): Observable<boolean> {
    const url = `${this.url}`;  // Asegúrate de que esta URL esté correctamente apuntando al endpoint de pacientes
    return this.http.get<PatientInterface[]>(url, { params: { cip } }).pipe(
      map(patients => {

        if (excludePatientCode) {
          // Filtrar el paciente actual si se proporciona un código
          patients = patients.filter(p => p.patientCode !== excludePatientCode);
        }
        return patients.length > 0;  // Si queda algún paciente con ese CIP, el CIP ya existe
      }),
      catchError(() => of(false))  // En caso de error, retornamos que no existe para no bloquear la validación
    );
  }

  //Actualizar paciente en searchPatient tras editar en recordComponent
  private patientUpdatedSource = new Subject<PatientInterface>();
  patientUpdated$ = this.patientUpdatedSource.asObservable();
  notifyPatientUpdated(patient: PatientInterface) {
    this.patientUpdatedSource.next(patient);
  }


}
