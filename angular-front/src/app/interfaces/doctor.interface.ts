import { WorkerInterface } from './worker.interface';

export interface DoctorInterface extends WorkerInterface {
  doctor_code: number;
  speciality: string;
}
