import { Worker } from './worker.interface';

export interface Nurse extends Worker {
  nurse_code: number;
  speciality: string;
}
