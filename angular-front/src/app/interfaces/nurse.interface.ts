import { WorkerInterface } from './worker.interface';

export interface NurseInterface extends WorkerInterface {
  nurse_code: number;
  speciality: string;
}
