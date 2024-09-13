export interface PatientInterface{
    code: number;
    name: string;
    surname1: string;
    surname2: string;
    dni: string;
    cip: string;
    gender: string;
    phone: string;
    email: string;
    age: number;
    birthdate: Date;
    country: string;
    status: string;
    type: string;
    idBed: string; //de momento para acepta "-".
}