import { AmbulatoryArea } from "../enums/ambulatory-area.enum";
import { HospitalZone } from "../enums/hospital-zones.enum";
import { HospitalizedArea } from "../enums/hospitalized-area.enum";
import { OperatingRoomArea } from "../enums/operatingRoom-area.enum";
import { UrgencyArea } from "../enums/urgency-area.enum";

export interface PatientInterface{

    id: number;
    name: string;
    surname1: string;
    surname2?: string;
    gender: string;
    birthDate: Date;
    age: number;
    country: string;
    address?: string;
    dni: string;
    cip?: string;
    email?: string;
    phone: string;

    patientCode: number;
    emergencyContact?: string;
    zone: HospitalZone | null;
    area: OperatingRoomArea | AmbulatoryArea | UrgencyArea | HospitalizedArea | null;
    reason?: string;
    bedId?: number;
    hospital: number;
}
