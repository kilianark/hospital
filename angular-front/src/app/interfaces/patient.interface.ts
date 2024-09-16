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
    phone: number;

    patient_code: number;
    emergencyContact?: string;
    status: string;
    reason?: string;
    bed_id?: string; //de momento para acepta "-".

    

    
    
}