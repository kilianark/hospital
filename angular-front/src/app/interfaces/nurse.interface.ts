import { WorkerInterface } from './worker.interface';

export interface NurseInterface extends WorkerInterface {
  nurseCode: string;
  speciality: string;
}
