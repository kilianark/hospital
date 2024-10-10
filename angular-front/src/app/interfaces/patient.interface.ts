import { HospitalZone } from "../enums/hospital-zones.enum";

export interface PatientInterface{

    id: number;
    name: string;
    surname1: string;
    surname2?: string;
    gender: string;
    birthDate: Date;
    age: number; //* ??? meter en modelo? */
    country: string;
    address?: string;
    dni: string;
    cip?: string;
    email?: string;
    phone: string;

    patientCode: number;
    emergencyContact?: string;
    status: HospitalZone | null;
    reason?: string;
    bedId?: number;
    roomId?: number;
}