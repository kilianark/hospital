export interface AppointmentInterface {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  reason: string;
  status: string;
}
