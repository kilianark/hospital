import { WorkerInterface } from './worker.interface';

export interface DoctorInterface extends WorkerInterface {
  doctorCode: string;
  speciality: string;
}
