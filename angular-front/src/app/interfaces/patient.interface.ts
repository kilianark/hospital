export interface PatientInterface{
    code: number;
    name: string;
    surname1: string;
    surname2: string;
    phone: number;
    age: number;
    birthdate: Date;
    status: string;
    type: string;
    idBed: string; //de momento para acepta "-".
}