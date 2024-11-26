import { WorkerInterface } from './worker.interface';

export interface NurseInterface extends WorkerInterface {
  nurse_code: string;
  speciality: string;
}
