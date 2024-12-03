export interface AppointmentInterface {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  status: string;
  reason: string;
  inUrgencies: boolean;
}
