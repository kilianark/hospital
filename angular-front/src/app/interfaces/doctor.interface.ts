import { Worker } from './worker.interface';

export interface Doctor extends Worker {
  doctor_code: number;
  speciality: string;
}
