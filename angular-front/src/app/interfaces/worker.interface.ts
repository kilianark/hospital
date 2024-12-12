export interface WorkerInterface {
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
  phone: number;
  username: string;
  workerCode: string;
  worktype: 'doctor' | 'nurse' | 'administrator';
  speciality: string;
  hospital: number;
  zone: number;
}
