export interface PatientInterface{

    id: number;
    name: string;
    surname1: string;
    surname2?: string;
    gender: string;
    birthdate: Date;
    age: number; //* ??? meter en modelo? */
    country: string;
    address?: string;
    dni: string;
    cip?: string;
    email?: string;
    phone: string;

    patient_code: number;
    emergencyContact?: string;
    status: string;
    reason?: string;
    bed_id?: number; //de momento para acepta "-".
   
}