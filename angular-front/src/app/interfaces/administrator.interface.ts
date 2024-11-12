import { Worker } from './worker.interface';

export interface Administrator extends Worker {
  admin_code: number;
}
