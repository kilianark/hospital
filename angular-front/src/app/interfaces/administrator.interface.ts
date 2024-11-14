import { WorkerInterface } from './worker.interface';

export interface Administrator extends WorkerInterface {
  admin_code: number;
}
