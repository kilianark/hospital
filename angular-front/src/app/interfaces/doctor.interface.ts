export interface DoctorInterface{
    
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
    phone: number;

    username: string;
    doctor_code: number;

    worktype: string;
    speciality: string;
    
}