export interface DoctorInterface{
    
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

    user: string;
    doctor_code: number;

    worker_type: string;
    speciality: string;
}